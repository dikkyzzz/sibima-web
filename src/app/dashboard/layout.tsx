'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    View,
    Flex,
    Text,
    ActionButton,
} from '@adobe/react-spectrum';

// Spectrum Icons
import Home from '@spectrum-icons/workflow/Home';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import Book from '@spectrum-icons/workflow/Book';
import GraphTrend from '@spectrum-icons/workflow/GraphTrend';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import Clock from '@spectrum-icons/workflow/Clock';
import DataDownload from '@spectrum-icons/workflow/DataDownload';
import Settings from '@spectrum-icons/workflow/Settings';
import Bell from '@spectrum-icons/workflow/Bell';
import LogOut from '@spectrum-icons/workflow/LogOut';

const menuItems = [
    { href: '/dashboard', label: 'Overview', Icon: Home },
    { href: '/dashboard/mahasiswa', label: 'Mahasiswa', Icon: User },
    { href: '/dashboard/dosen', label: 'Dosen', Icon: UserGroup },
    { href: '/dashboard/bimbingan', label: 'Bimbingan', Icon: Book },
    { href: '/dashboard/progress', label: 'Progress', Icon: GraphTrend },
    { href: '/dashboard/documents', label: 'Dokumen', Icon: FolderOpen },
    { href: '/dashboard/activity', label: 'Aktivitas', Icon: Clock },
    { href: '/dashboard/reports', label: 'Laporan', Icon: DataDownload },
    { href: '/dashboard/settings', label: 'Pengaturan', Icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const currentPage = menuItems.find(
        (item) =>
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#F5F5F5' }}>
            {/* Sidebar - Fixed */}
            <aside style={{
                width: '256px',
                height: '100vh',
                position: 'sticky',
                top: 0,
                backgroundColor: '#1D1D1D',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}>
                {/* Logo */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Flex alignItems="center" gap="size-150">
                        <img
                            src="/logo.png"
                            alt="SIBIMA Logo"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                objectFit: 'contain',
                            }}
                        />
                        <div>
                            <Text UNSAFE_style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>
                                SIBIMA
                            </Text>
                            <Text UNSAFE_style={{ color: '#999', fontSize: '11px', display: 'block' }}>
                                Admin Dashboard
                            </Text>
                        </div>
                    </Flex>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            const IconComponent = item.Icon;

                            return (
                                <li key={item.href} style={{ marginBottom: '4px' }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            borderRadius: '6px',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : '#999',
                                            backgroundColor: isActive ? '#1473E6' : 'transparent',
                                            transition: 'all 0.15s ease',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <IconComponent size="S" UNSAFE_style={{ color: isActive ? 'white' : '#999' }} />
                                        <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User section */}
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Flex alignItems="center" gap="size-150" marginBottom="size-150">
                        <div style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#333',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <User size="S" UNSAFE_style={{ color: '#999' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Text UNSAFE_style={{
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: 500,
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                Admin TU
                            </Text>
                            <Text UNSAFE_style={{
                                color: '#666',
                                fontSize: '11px',
                                display: 'block',
                            }}>
                                admin@kampus.ac.id
                            </Text>
                        </div>
                    </Flex>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px',
                            marginTop: '12px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#FF6B6B',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        <LogOut size="S" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflow: 'auto' }}>
                {/* Header */}
                <header style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #E1E1E1',
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <Text UNSAFE_style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#1D1D1D'
                        }}>
                            {currentPage?.label || 'Dashboard'}
                        </Text>
                    </div>
                    <Flex alignItems="center" gap="size-200">
                        <ActionButton isQuiet aria-label="Notifications">
                            <Bell size="S" />
                        </ActionButton>
                    </Flex>
                </header>

                {/* Page content */}
                <div style={{ padding: '32px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
