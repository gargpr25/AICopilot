"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { SearchModal } from "./search-modal";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="atlas-bg" />
      <div className="atlas-grid" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border glass-strong flex flex-col transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent3 glow">
            <Icon name="Braces" size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm gradient-text">GenAI Atlas</div>
            <div className="text-[10px] text-muted">Architecture Explorer</div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted/70">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                        active ? "bg-white/10 text-foreground" : "text-muted hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      <Icon name={item.icon} size={17} className={active ? "text-accent2" : ""} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-muted hover:bg-white/10 transition"
          >
            <Icon name="Search" size={15} />
            <span>Search</span>
            <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Icon name="Menu" size={22} />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-1.5 text-sm text-muted hover:bg-white/10 transition"
          >
            <Icon name="Search" size={15} />
            <span className="truncate">Search the Atlas…</span>
            <kbd className="ml-auto hidden sm:block rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/flow" className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent3 px-3 py-1.5 text-sm font-semibold text-white glow">
              <Icon name="Play" size={14} /> Run the Flow
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white/5 hover:bg-white/10 transition"
              aria-label="GitHub"
            >
              <Icon name="Github" size={17} />
            </a>
          </div>
        </header>

        <main className="px-4 py-8 lg:px-8">{children}</main>

        <footer className="border-t border-border px-4 lg:px-8 py-8 text-sm text-muted">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>GenAI Architecture Atlas — an interactive map of modern Generative AI systems.</span>
            <span className="text-xs">Built with Next.js · React Flow · Framer Motion</span>
          </div>
        </footer>
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
