'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    Heading,
    ProgressBar,
} from '@adobe/react-spectrum';

// Spectrum Icons  
import Home from '@spectrum-icons/workflow/Home';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import Calendar from '@spectrum-icons/workflow/Calendar';
import Chat from '@spectrum-icons/workflow/Chat';
import Edit from '@spectrum-icons/workflow/Edit';

import { getDashboardStats, getRecentActivity } from '@/lib/api';

interface DashboardStats {
    totalMahasiswa: number;
    totalDosen: number;
    activeBimbingan: number;
    completedBimbingan: number;
    onTrackStudents: number;
    delayedStudents: number;
    atRiskStudents: number;
    avgSessionsPerStudent: number;
}

interface Activity {
    id: string;
    type: string;
    user: string;
    action: string;
    time: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, activityData] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivity(5)
                ]);
                setStats(statsData);
                setActivities(activityData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback to mock if DB empty
                setStats({
                    totalMahasiswa: 0,
                    totalDosen: 0,
                    activeBimbingan: 0,
                    completedBimbingan: 0,
                    onTrackStudents: 0,
                    delayedStudents: 0,
                    atRiskStudents: 0,
                    avgSessionsPerStudent: 0,
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <Chat size="S" />;
            case 'schedule':
                return <Calendar size="S" />;
            case 'edit':
                return <Edit size="S" />;
            default:
                return <Home size="S" />;
        }
    };

    const formatTime = (time: string) => {
        const date = new Date(time);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Baru saja';
        if (hours < 24) return `${hours} jam lalu`;
        return date.toLocaleDateString('id-ID');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading dashboard...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div>
                <Heading level={1}>Dashboard</Heading>
                <Text UNSAFE_style={{ color: '#6E6E6E' }}>Selamat datang di SIBIMA Admin</Text>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex justifyContent="space-between" alignItems="start">
                        <div>
                            <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                Total Mahasiswa
                            </Text>
                            <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#1473E6' }}>
                                {stats?.totalMahasiswa || 0}
                            </Text>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#E6F2FF',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1473E6',
                        }}>
                            <User size="M" />
                        </div>
                    </Flex>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex justifyContent="space-between" alignItems="start">
                        <div>
                            <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                Total Dosen
                            </Text>
                            <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#0D7C0D' }}>
                                {stats?.totalDosen || 0}
                            </Text>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#E6FFE6',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0D7C0D',
                        }}>
                            <UserGroup size="M" />
                        </div>
                    </Flex>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex justifyContent="space-between" alignItems="start">
                        <div>
                            <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                Bimbingan Aktif
                            </Text>
                            <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#7C3AED' }}>
                                {stats?.activeBimbingan || 0}
                            </Text>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#F3E8FF',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7C3AED',
                        }}>
                            <Calendar size="M" />
                        </div>
                    </Flex>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex justifyContent="space-between" alignItems="start">
                        <div>
                            <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                Selesai
                            </Text>
                            <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#D97706' }}>
                                {stats?.completedBimbingan || 0}
                            </Text>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#FEF3C7',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D97706',
                        }}>
                            <Home size="M" />
                        </div>
                    </Flex>
                </div>
            </div>

            {/* Progress Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Student Status */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Heading level={3} marginBottom="size-300">Status Mahasiswa</Heading>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <Flex justifyContent="space-between" marginBottom="size-75">
                                <Text>On Track</Text>
                                <Text UNSAFE_style={{ color: '#0D7C0D', fontWeight: 600 }}>{stats?.onTrackStudents || 0}</Text>
                            </Flex>
                            <ProgressBar
                                value={stats?.activeBimbingan ? ((stats?.onTrackStudents || 0) / stats.activeBimbingan * 100) : 0}
                                aria-label="On Track"
                            />
                        </div>

                        <div>
                            <Flex justifyContent="space-between" marginBottom="size-75">
                                <Text>Delayed</Text>
                                <Text UNSAFE_style={{ color: '#D97706', fontWeight: 600 }}>{stats?.delayedStudents || 0}</Text>
                            </Flex>
                            <ProgressBar
                                value={stats?.activeBimbingan ? ((stats?.delayedStudents || 0) / stats.activeBimbingan * 100) : 0}
                                aria-label="Delayed"
                                variant="warning"
                            />
                        </div>

                        <div>
                            <Flex justifyContent="space-between" marginBottom="size-75">
                                <Text>At Risk</Text>
                                <Text UNSAFE_style={{ color: '#D91A1A', fontWeight: 600 }}>{stats?.atRiskStudents || 0}</Text>
                            </Flex>
                            <ProgressBar
                                value={stats?.activeBimbingan ? ((stats?.atRiskStudents || 0) / stats.activeBimbingan * 100) : 0}
                                aria-label="At Risk"
                                variant="critical"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Heading level={3} marginBottom="size-300">Rata-rata</Heading>

                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <Text UNSAFE_style={{ fontSize: '48px', fontWeight: 700, color: '#1473E6' }}>
                            {stats?.avgSessionsPerStudent?.toFixed(1) || '0'}
                        </Text>
                        <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', marginTop: '8px' }}>
                            Sesi per Mahasiswa
                        </Text>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid #E1E1E1',
            }}>
                <Heading level={3} marginBottom="size-300">Aktivitas Terbaru</Heading>

                {activities.length === 0 ? (
                    <Text UNSAFE_style={{ color: '#6E6E6E', textAlign: 'center', display: 'block', padding: '32px' }}>
                        Belum ada aktivitas. Data akan muncul saat ada interaksi di sistem.
                    </Text>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activities.map((activity) => (
                            <Flex key={activity.id} alignItems="center" gap="size-200">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6E6E6E',
                                }}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text UNSAFE_style={{ fontWeight: 500 }}>
                                        {activity.user}
                                    </Text>
                                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '13px' }}>
                                        {activity.action}
                                    </Text>
                                </div>
                                <Text UNSAFE_style={{ color: '#999', fontSize: '12px' }}>
                                    {formatTime(activity.time)}
                                </Text>
                            </Flex>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
