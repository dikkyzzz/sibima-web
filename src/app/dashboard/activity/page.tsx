'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    ActionButton,
    Text,
    Heading,
    Picker,
    Item,
} from '@adobe/react-spectrum';
import Download from '@spectrum-icons/workflow/Download';
import Clock from '@spectrum-icons/workflow/Clock';
import Calendar from '@spectrum-icons/workflow/Calendar';
import Chat from '@spectrum-icons/workflow/Chat';
import { getRecentActivity } from '@/lib/api';

interface Activity {
    id: string;
    type: string;
    user: string;
    action: string;
    time: string;
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getRecentActivity(50);
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <Chat size="S" UNSAFE_style={{ color: '#1473E6' }} />;
            case 'schedule':
                return <Calendar size="S" UNSAFE_style={{ color: '#0D7C0D' }} />;
            default:
                return <Clock size="S" UNSAFE_style={{ color: '#6E6E6E' }} />;
        }
    };

    const getActivityBg = (type: string) => {
        switch (type) {
            case 'message':
                return '#E6F2FF';
            case 'schedule':
                return '#E6FFE6';
            default:
                return '#F5F5F5';
        }
    };

    const formatTime = (time: string) => {
        const date = new Date(time);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredActivities = typeFilter === 'all'
        ? activities
        : activities.filter(a => a.type === typeFilter);

    const handleExportCSV = () => {
        const headers = ['Waktu', 'Tipe', 'User', 'Aktivitas'];
        const rows = filteredActivities.map(a => [
            formatTime(a.time),
            a.type,
            a.user,
            a.action,
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'activity_log.csv';
        link.click();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading activities...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Log Aktivitas</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                        {activities.length} aktivitas tercatat
                    </Text>
                </div>
                <ActionButton onPress={handleExportCSV}>
                    <Download />
                    <Text>Export CSV</Text>
                </ActionButton>
            </Flex>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex alignItems="center" gap="size-150">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#E6F2FF',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Chat size="S" UNSAFE_style={{ color: '#1473E6' }} />
                        </div>
                        <div>
                            <Text UNSAFE_style={{ fontSize: '24px', fontWeight: 700, color: '#1473E6' }}>
                                {activities.filter(a => a.type === 'message').length}
                            </Text>
                            <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>
                                Pesan
                            </Text>
                        </div>
                    </Flex>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex alignItems="center" gap="size-150">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#E6FFE6',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Calendar size="S" UNSAFE_style={{ color: '#0D7C0D' }} />
                        </div>
                        <div>
                            <Text UNSAFE_style={{ fontSize: '24px', fontWeight: 700, color: '#0D7C0D' }}>
                                {activities.filter(a => a.type === 'schedule').length}
                            </Text>
                            <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>
                                Jadwal
                            </Text>
                        </div>
                    </Flex>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                }}>
                    <Flex alignItems="center" gap="size-150">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#F5F5F5',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Clock size="S" UNSAFE_style={{ color: '#6E6E6E' }} />
                        </div>
                        <div>
                            <Text UNSAFE_style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>
                                {activities.length}
                            </Text>
                            <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>
                                Total
                            </Text>
                        </div>
                    </Flex>
                </div>
            </div>

            {/* Filter */}
            <Picker
                label="Filter Tipe"
                selectedKey={typeFilter}
                onSelectionChange={(key) => setTypeFilter(key as string)}
                width="size-2400"
            >
                <Item key="all">Semua Aktivitas</Item>
                <Item key="message">Pesan</Item>
                <Item key="schedule">Jadwal</Item>
            </Picker>

            {/* Activity List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E1E1E1',
            }}>
                {filteredActivities.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <Clock size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                        <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                            Belum ada aktivitas tercatat.
                        </Text>
                    </div>
                ) : (
                    <div>
                        {filteredActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                style={{
                                    padding: '16px 24px',
                                    borderBottom: index < filteredActivities.length - 1 ? '1px solid #F5F5F5' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: getActivityBg(activity.type),
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text UNSAFE_style={{ fontWeight: 500 }}>{activity.user}</Text>
                                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '13px' }}>
                                        {activity.action}
                                    </Text>
                                </div>
                                <Text UNSAFE_style={{ color: '#999', fontSize: '12px', flexShrink: 0 }}>
                                    {formatTime(activity.time)}
                                </Text>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
