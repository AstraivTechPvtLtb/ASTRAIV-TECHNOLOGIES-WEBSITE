'use client';

import { ReactNode } from 'react';
import { Sidebar, DashboardRole } from './sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SearchInput } from '@/components/ui/search-input';
import { Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  role?: DashboardRole;
  breadcrumbs?: { label: string; href?: string }[];
  userName?: string;
  userEmail?: string;
}

export function DashboardLayout({
  children,
  role = 'USER',
  breadcrumbs = [{ label: 'Dashboard' }],
  userName,
  userEmail,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar role={role} userName={userName} userEmail={userEmail} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Toolbar */}
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/45 backdrop-blur-md">
          {/* Breadcrumb section */}
          <div className="flex items-center gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator className="mx-2" />}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-foreground">{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href || '#'} className="text-muted-foreground hover:text-foreground">
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Quick Search and Utilities */}
          <div className="flex items-center gap-4 w-72 sm:w-96 justify-end">
            <SearchInput placeholder="Quick search..." className="h-8.5 bg-background/80" />
            <Button variant="ghost" size="icon" className="relative h-8.5 w-8.5 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        {/* Dynamic Scroll Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/50">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
