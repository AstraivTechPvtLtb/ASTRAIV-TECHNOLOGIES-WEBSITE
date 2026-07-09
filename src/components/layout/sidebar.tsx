'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LifeBuoy,
  Settings,
  CreditCard,
  User,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

export type DashboardRole = 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | 'USER';

interface SidebarProps {
  role?: DashboardRole;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function Sidebar({
  role = 'USER',
  userName = 'Arghya',
  userEmail = 'arghya@astraiv.com',
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Define navigation sections depending on the role
  const getNavLinks = () => {
    const commonLinks = [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Profile', href: '/profile', icon: User },
      { label: 'Billing', href: '/billing', icon: CreditCard },
    ];

    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Admin Panel', href: '/admin', icon: LayoutDashboard },
          { label: 'User Directory', href: '/admin/users', icon: Users },
          { label: 'Projects Manager', href: '/admin/projects', icon: FolderKanban },
          { label: 'CRM Leads', href: '/admin/leads', icon: TrendingUp },
          { label: 'Support Tickets', href: '/admin/tickets', icon: LifeBuoy },
          { label: 'Blog CMS', href: '/admin/blog', icon: FileText },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'PROJECT_MANAGER':
        return [
          { label: 'Manager Home', href: '/manager', icon: LayoutDashboard },
          { label: 'Assigned Projects', href: '/manager/projects', icon: FolderKanban },
          { label: 'Support Tickets', href: '/manager/tickets', icon: LifeBuoy },
          { label: 'Settings', href: '/manager/settings', icon: Settings },
        ];
      case 'CLIENT':
        return [
          { label: 'Client Home', href: '/client', icon: LayoutDashboard },
          { label: 'My Projects', href: '/client/projects', icon: FolderKanban },
          { label: 'Support Tickets', href: '/client/tickets', icon: LifeBuoy },
          { label: 'Billing & Invoices', href: '/client/billing', icon: CreditCard },
          { label: 'Settings', href: '/client/settings', icon: Settings },
        ];
      case 'USER':
      default:
        return [
          ...commonLinks,
          { label: 'Help Desk', href: '/support', icon: LifeBuoy },
          { label: 'Account Settings', href: '/settings', icon: Settings },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <aside
      className={cn(
        'relative h-screen bg-card border-r border-border/40 flex flex-col justify-between transition-all duration-300 z-30 shrink-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/10">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-foreground overflow-hidden">
          <Image
            src="/logo-icon.jpg"
            alt="Astraiv Logo"
            width={28}
            height={28}
            className="rounded-full object-cover shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0 leading-[1.05]">
              <span className="font-extrabold text-sm tracking-wider text-foreground">ASTRAIV</span>
              <span className="text-[7px] uppercase tracking-[0.25em] font-black text-black dark:text-white dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.85)] mt-0.5">TECHNOLOGIES</span>
            </div>
          )}
        </Link>

        {/* Collapsible toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-border/40 bg-card shadow-xs flex items-center justify-center p-0 hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4.5 w-4.5 shrink-0 group-hover:scale-105 transition-transform')} />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/40 overflow-hidden">
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-foreground truncate">{userName}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
          {!collapsed && onLogout && (
            <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
