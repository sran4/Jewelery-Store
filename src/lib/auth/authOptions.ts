import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";
import { rateLimitLogin } from "@/lib/rateLimit";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider (Primary Login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Rate limiting
          const rateLimit = rateLimitLogin(credentials.email);
          if (!rateLimit.success) {
            throw new Error(
              `Too many login attempts. Please try again after ${new Date(
                rateLimit.resetTime
              ).toLocaleTimeString()}`
            );
          }

          await connectDB();

          // Find admin by email (case-insensitive)
          const admin = await Admin.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!admin) {
            throw new Error("Invalid email or password");
          }

          // Check if account is locked
          if (admin.isLocked) {
            throw new Error(
              `Account is locked due to too many failed attempts. Try again later or use Google login.`
            );
          }

          // Verify password
          const isPasswordValid = await admin.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) {
            await admin.incLoginAttempts();
            throw new Error("Invalid email or password");
          }

          // Reset login attempts on successful login
          admin.loginAttempts = 0;
          admin.lockUntil = undefined;
          admin.lastLogin = new Date();
          await admin.save();

          return {
            id: String(admin._id),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),

    // Google Provider (Backup Login)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Google OAuth Sign In
      if (account?.provider === "google") {
        const allowedEmail = process.env.GOOGLE_ADMIN_EMAIL?.toLowerCase();

        if (!allowedEmail) {
          return false; // Google OAuth not configured
        }

        // Check if this is the whitelisted admin email
        if (user.email?.toLowerCase() !== allowedEmail) {
          return false; // Not authorized
        }

        try {
          await connectDB();

          // Find or create admin with Google ID
          let admin = await Admin.findOne({
            googleId: account.providerAccountId,
          });

          if (!admin) {
            // Check if admin exists with this email
            admin = await Admin.findOne({ email: user.email?.toLowerCase() });

            if (admin) {
              // Link Google account to existing admin
              admin.googleId = account.providerAccountId;
              admin.lastLogin = new Date();
              await admin.save();
            } else {
              // Create new admin (first-time Google login)
              admin = await Admin.create({
                email: user.email?.toLowerCase(),
                googleId: account.providerAccountId,
                name: user.name || "Admin",
                role: "admin",
                lastLogin: new Date(),
              });
            }
          } else {
            // Update last login
            admin.lastLogin = new Date();
            await admin.save();
          }

          return true;
        } catch (error) {
          console.error("Google Sign In Error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role || "admin";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

