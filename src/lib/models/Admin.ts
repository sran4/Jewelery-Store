import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  googleId?: string;
  name: string;
  role: string;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<this>;
  isLocked(): boolean;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Case-insensitive
      trim: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Invalid email format',
      },
    },
    passwordHash: {
      type: String,
      required: function(this: IAdmin) {
        return !this.googleId; // Password required if not using Google OAuth
      },
    },
    googleId: {
      type: String,
      sparse: true, // Unique but allows null
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'super_admin'],
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ googleId: 1 });

// Virtual for checking if account is locked
AdminSchema.virtual('isLocked').get(function(this: IAdmin) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Methods
AdminSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

AdminSchema.methods.incLoginAttempts = async function(): Promise<IAdmin> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Otherwise increment attempts
  const updates: any = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 1 hour
  const maxAttempts = parseInt(process.env.RATE_LIMIT_LOGIN_ATTEMPTS || '5');
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + 3600000) }; // 1 hour
  }

  return this.updateOne(updates);
};

AdminSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Static method to create admin
AdminSchema.statics.createAdmin = async function(
  email: string,
  password: string,
  name: string
) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return this.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: 'admin',
  });
};

// Prevent model recompilation in development
const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;

