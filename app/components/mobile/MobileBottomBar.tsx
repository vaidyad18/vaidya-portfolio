"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  HiOutlineHome, HiHome, 
  HiOutlineFolder, HiFolder, 
  HiOutlineBriefcase, HiBriefcase, 
  HiOutlineDocumentText, HiDocumentText, 
  HiOutlineUser, HiUser 
} from 'react-icons/hi2';
import Link from 'next/link';

// Phase 1 & 7: Define local constant for routes with Outline (inactive) and Solid (active) variants
const NAVIGATION_ROUTES = [
  { name: 'Home', path: '/', outlineIcon: HiOutlineHome, solidIcon: HiHome },
  { name: 'Projects', path: '/projects', outlineIcon: HiOutlineFolder, solidIcon: HiFolder },
  { name: 'Exp', path: '/experience', outlineIcon: HiOutlineBriefcase, solidIcon: HiBriefcase },
  { name: 'Resume', path: '/resume.pdf', outlineIcon: HiOutlineDocumentText, solidIcon: HiDocumentText, external: true },
  { name: 'About', path: '/about', outlineIcon: HiOutlineUser, solidIcon: HiUser },
];

export default function MobileBottomBar() {
  const currentPath = usePathname();

  return (
    // Phase 2, 6, & 8: Fluid Neobrutalist UI, True Glassmorphism, and Desktop Protection (xl:hidden)
    <div className="xl:hidden fixed bottom-[var(--spacing-fluid-sm)] inset-x-[var(--spacing-fluid-sm)] mx-auto max-w-md z-50 pb-[env(safe-area-inset-bottom)]">
      {/* 
        bg-gradient: Directional light wash (simulates light hitting the surface)
        backdrop-blur-xl + saturate-200: Max refraction engine for vibrant, deep blurs
        ring-inset: Specular highlight (rim lighting) mimicking the glass edge
      */}
      <nav className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl backdrop-saturate-200 border-[3px] border-border rounded-2xl ring-1 ring-inset ring-white/50 drop-shadow-md">
        <ul className="flex justify-between items-center w-full px-[var(--spacing-fluid-sm)] py-[var(--spacing-fluid-xs)]">
          {NAVIGATION_ROUTES.map((route) => {
            const isActive = currentPath === route.path;
            const Icon = isActive ? route.solidIcon : route.outlineIcon;
            const LinkComponent = route.external ? 'a' : Link;
            const externalProps = route.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            
            return (
              <li key={route.name} className="flex-1 flex justify-center">
                {/* Phase 3, 5, & 7: Touch Targets, Vertical Rhythm, Active State Dot, and 100% Opacity Icons */}
                <LinkComponent 
                  href={route.path}
                  title={route.name}
                  {...externalProps}
                  className="flex flex-col justify-center items-center gap-1 min-h-11 min-w-11 transition-transform active:scale-95 text-foreground"
                  aria-label={route.name}
                >
                  <Icon className="text-h2" />
                  {/* Active State Dot - Present in DOM for rhythm, visible only when active */}
                  <span 
                    className={`w-[var(--spacing-fluid-xs)] h-[var(--spacing-fluid-xs)] rounded-full transition-opacity ${
                      isActive ? 'bg-accent opacity-100' : 'bg-transparent opacity-0'
                    }`} 
                  />
                </LinkComponent>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
