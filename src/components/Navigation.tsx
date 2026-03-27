'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: '전체 헤드라인', href: '/' },
    { name: '국내 주식', href: '/domestic' },
    { name: '해외 주식', href: '/global' },
    { name: '암호화폐', href: '/crypto' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm
                transition-colors duration-200
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
