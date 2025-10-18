'use client';

import { useSession } from 'next-auth/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Package, ShoppingBag, Mail, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  newSubmissions: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    newSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, contactRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/contact'),
      ]);

      const productsData = await productsRes.json();
      const contactData = await contactRes.json();

      if (productsData.success) {
        const products = productsData.products;
        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
          inStockProducts: products.filter((p: any) => p.inStock).length,
          outOfStockProducts: products.filter((p: any) => !p.inStock).length,
        }));
      }

      if (contactData.success) {
        const newCount = contactData.submissions.filter(
          (s: any) => s.status === 'new'
        ).length;
        setStats((prev) => ({ ...prev, newSubmissions: newCount }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'In Stock',
      value: stats.inStockProducts,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'New Inquiries',
      value: stats.newSubmissions,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">
            Welcome back, {session?.user?.name || 'Admin'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your jewelry store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-background border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products/new">
              <Button className="w-full" size="lg">
                <Package className="w-5 h-5 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full" size="lg">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/contact">
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                View Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

