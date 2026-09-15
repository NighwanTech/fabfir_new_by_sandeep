"use client";

import { useEffect, useState } from 'react';
import { Users, FileText, CheckCircle, Eye, TrendingUp, ArrowUpRight, Activity, Clock } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalAssessments: number;
  newAssessments: number;
  acceptedClients: number;
  totalVisitors: number;
}

const quickLinks = [
  { label: 'Assessments', href: '/admin/assessments', desc: 'Manage leads & enquiries', color: 'from-violet-500/20 to-violet-900/10', border: 'border-violet-500/30', icon: FileText, iconColor: 'text-violet-400' },
  { label: 'Hero Slides', href: '/admin/hero', desc: 'Edit homepage banner', color: 'from-blue-500/20 to-blue-900/10', border: 'border-blue-500/30', icon: Eye, iconColor: 'text-blue-400' },
  { label: 'Programs', href: '/admin/programs', desc: 'Update programs & pricing', color: 'from-amber-500/20 to-amber-900/10', border: 'border-amber-500/30', icon: Activity, iconColor: 'text-amber-400' },
  { label: 'Transformations', href: '/admin/transformations/cards', desc: 'Before & after cards', color: 'from-emerald-500/20 to-emerald-900/10', border: 'border-emerald-500/30', icon: TrendingUp, iconColor: 'text-emerald-400' },
  { label: 'Testimonials', href: '/admin/testimonials', desc: 'Client reviews', color: 'from-rose-500/20 to-rose-900/10', border: 'border-rose-500/30', icon: Users, iconColor: 'text-rose-400' },
  { label: 'Gallery', href: '/admin/gallery', desc: 'Photo gallery', color: 'from-cyan-500/20 to-cyan-900/10', border: 'border-cyan-500/30', icon: CheckCircle, iconColor: 'text-cyan-400' },
];

const statCards = [
  {
    key: 'totalAssessments' as keyof DashboardStats,
    label: 'Total Assessments',
    icon: FileText,
    gradient: 'from-[#FFB81C]/20 to-transparent',
    iconBg: 'bg-[#FFB81C]/10',
    iconColor: 'text-[#FFB81C]',
    border: 'border-[#FFB81C]/20',
    glow: 'shadow-[0_0_20px_rgba(255,184,28,0.08)]',
  },
  {
    key: 'newAssessments' as keyof DashboardStats,
    label: 'New Leads',
    icon: TrendingUp,
    gradient: 'from-violet-500/20 to-transparent',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/20',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.08)]',
    badge: true,
  },
  {
    key: 'acceptedClients' as keyof DashboardStats,
    label: 'Accepted Clients',
    icon: CheckCircle,
    gradient: 'from-emerald-500/20 to-transparent',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.08)]',
  },
  {
    key: 'totalVisitors' as keyof DashboardStats,
    label: 'Website Visitors',
    icon: Eye,
    gradient: 'from-blue-500/20 to-transparent',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/visitors/dashboard`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetVisitors = async () => {
    if (!confirm("Are you sure you want to reset the Website Visitors count to 0?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/visitors/reset`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setStats(prev => prev ? { ...prev, totalVisitors: 0 } : null);
      }
    } catch (error) {
      console.error('Failed to reset visitors count:', error);
    }
  };

  return (
    <div className="space-y-8 p-1">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with FabFit today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(({ key, label, icon: Icon, gradient, iconBg, iconColor, border, glow, badge }) => (
            <div
              key={key}
              className={`relative overflow-hidden rounded-2xl border ${border} bg-white ${glow} p-5 group hover:scale-[1.02] transition-transform duration-200`}
            >
              {/* gradient top strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient.replace('to-transparent', 'to-white/0')}`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                {badge && (stats?.newAssessments ?? 0) > 0 && (
                  <span className="flex h-5 w-5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-violet-500 items-center justify-center text-white text-[10px] font-black">N</span>
                  </span>
                )}
                {key === 'totalVisitors' && (
                  <button
                    onClick={handleResetVisitors}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 border border-gray-200 rounded px-2 py-1 transition-colors"
                    title="Reset visitor counter to 0"
                  >
                    Reset to 0
                  </button>
                )}
              </div>

              <div className="text-3xl font-black text-gray-900 mb-1">
                {stats?.[key] ?? 0}
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick Access</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(({ label, href, desc, color, border, icon: Icon, iconColor }) => (
          <Link
            key={label}
            href={href}
            className={`group relative overflow-hidden rounded-xl border ${border} bg-gradient-to-br ${color} p-5 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>
            <div className="font-bold text-gray-900 text-sm mb-0.5">{label}</div>
            <div className="text-xs text-gray-500">{desc}</div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 pt-2">
        FabFit Performance Admin · All data is live from your database
      </p>
    </div>
  );
}
