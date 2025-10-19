// TEMPORARILY DISABLED FOR DEBUGGING
// Auth checks moved to individual pages

export const metadata = {
  title: "Admin Panel | Shergill Official",
  description: "Admin dashboard for managing jewelry store",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NO AUTH CHECK - debugging redirect loop
  return <>{children}</>;
}
