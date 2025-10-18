import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata = {
  title: 'Admin Panel | Luxury Jewelry',
  description: 'Admin dashboard for managing jewelry store',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session && !children.toString().includes('login')) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}

