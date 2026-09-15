"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/assets/logo.png';
import { 
  LayoutDashboard, 
  Users, 
  Image as ImageIcon, 
  Menu,
  X,
  Dumbbell,
  ClipboardList,
  Star,
  Settings,
  Bell,
  Search,
  LogOut,
  TrendingUp,
  ChevronDown,
  BadgeCheck,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          setIsCheckingAuth(false);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
    { name: 'Stats', href: '/admin/counters', icon: TrendingUp },
    { 
      name: 'Coaches', 
      href: '/admin/coaches', 
      icon: Users,
      subItems: [
        { name: 'Head Coach', href: '/admin/coaches/head-coach' },
        { name: 'Team Section', href: '/admin/coaches/team-section' },
        { name: 'Team Members', href: '/admin/coaches/team-members' }
      ]
    },
    { 
      name: 'Transformations', 
      href: '/admin/transformations', 
      icon: Star,
      subItems: [
        { name: 'Section', href: '/admin/transformations/section' },
        { name: 'Cards', href: '/admin/transformations/cards' }
      ]
    },
    { name: 'Hero Section', href: '/admin/hero', icon: Star },
    { name: 'About Section', href: '/admin/about', icon: ClipboardList },
    { 
      name: 'Gallery', 
      href: '/admin/gallery', 
      icon: ImageIcon,
      subItems: [
        { name: 'Image Gallery', href: '/admin/gallery/images' },
        { name: 'Video Gallery', href: '/admin/gallery/videos' },
      ]
    },
    { 
      name: 'Programs', 
      href: '/admin/programs', 
      icon: Dumbbell,
      subItems: [
        { name: 'Section', href: '/admin/programs/section' },
        { name: 'Programs', href: '/admin/programs' },
        { name: 'Highlights', href: '/admin/programs/highlights' },
      ]
    },
    { name: 'Services', href: '/admin/services', icon: Dumbbell },
    { 
      name: 'Membership', 
      href: '/admin/membership', 
      icon: BadgeCheck,
      subItems: [
        { name: 'Section', href: '/admin/membership/section' },
        { name: 'Plans', href: '/admin/membership/plans' },
      ]
    },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Page Structure', href: '/admin/page-structure', icon: Menu },
  ];

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Gallery': pathname?.includes('/admin/gallery') || false,
    'Programs': pathname?.includes('/admin/programs') || false,
    'Membership': pathname?.includes('/admin/membership') || false,
    'Coaches': pathname?.includes('/admin/coaches') || false,
    'Transformations': pathname?.includes('/admin/transformations') || false
  });

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="h-8 w-8 animate-spin text-black mb-4" />
        <span className="font-medium text-zinc-500">Verifying secure access...</span>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f8f9fa] flex flex-col md:flex-row">
      {/* Mobile sidebar backdrop */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#050505] border-r border-zinc-800 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <div className="flex items-center">
            <img src={Logo.src} alt="FabFit Logo" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 py-6 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Menu</div>
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              if (item.subItems) {
                const isExpanded = expandedMenus[item.name];
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        (isActive || isExpanded)
                          ? 'bg-primary text-black' 
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={(isActive || isExpanded) ? 'text-black' : 'text-zinc-400'} />
                        {item.name}
                      </div>
                      <ChevronDown size={16} className={`transition-transform ${(isActive || isExpanded) ? 'text-black' : 'text-zinc-400'} ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isExpanded && (
                      <div className="pl-10 pr-3 space-y-1 mt-1">
                        {item.subItems.map(subItem => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(true)}
                              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isSubActive
                                  ? 'bg-zinc-800 text-primary'
                                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setExpandedMenus({});
                    setSidebarOpen(true);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary text-black' 
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-black' : 'text-zinc-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors w-full">
            <LayoutDashboard size={18} className="text-zinc-400" />
            Back to Site
          </Link>
          <button 
            onClick={async () => {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
              });
              window.location.href = '/login';
            }} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Topbar */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search size={16} className="absolute left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-8 w-8 bg-black text-primary rounded-full flex items-center justify-center font-bold text-sm border border-gray-200 ml-2">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-x-hidden overflow-y-auto bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  );
}
