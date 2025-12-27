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
import Print from '@spectrum-icons/workflow/Print';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import { getSKPReports, getDosenList } from '@/lib/api';

interface SKPRecord {
    id: string;
    periode: string;
    total_sessions: number;
    total_mahasiswa: number;
    completed_mahasiswa: number;
    response_rate: number;
    avg_response_time_hours: number;
    dosen: { id: string; full_name: string; nim_nidn: string } | null;
}

export default function ReportsPage() {
    const [skpRecords, setSkpRecords] = useState<SKPRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [periode, setPeriode] = useState('2024-1');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSKPReports(periode);
                setSkpRecords(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [periode]);

    const handleExportCSV = () => {
        const headers = ['Dosen', 'NIDN', 'Total Sesi', 'Mahasiswa', 'Selesai', 'Response Rate', 'Avg Response'];
        const rows = skpRecords.map(r => [
            r.dosen?.full_name || '-',
            r.dosen?.nim_nidn || '-',
            r.total_sessions,
            r.total_mahasiswa,
            r.completed_mahasiswa,
            `${r.response_rate}%`,
            `${r.avg_response_time_hours}h`,
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `skp_report_${periode}.csv`;
        a.click();
    };

    const totalSessions = skpRecords.reduce((sum, r) => sum + r.total_sessions, 0);
    const totalMahasiswa = skpRecords.reduce((sum, r) => sum + r.total_mahasiswa, 0);
    const avgResponseRate = skpRecords.length > 0
        ? (skpRecords.reduce((sum, r) => sum + r.response_rate, 0) / skpRecords.length).toFixed(1)
        : '0';

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading reports...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Laporan SKP</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>Satuan Kredit Partisipasi Dosen</Text>
                </div>
                <Flex gap="size-100">
                    <ActionButton onPress={handleExportCSV}>
                        <Download />
                        <Text>Export CSV</Text>
                    </ActionButton>
                    <ActionButton>
                        <Print />
                        <Text>Print</Text>
                    </ActionButton>
                </Flex>
            </Flex>

            {/* Filter */}
            <Picker
                label="Periode"
                selectedKey={periode}
                onSelectionChange={(key) => setPeriode(key as string)}
                width="size-2400"
            >
                <Item key="2024-1">Semester Ganjil 2024</Item>
                <Item key="2024-2">Semester Genap 2024</Item>
                <Item key="2023-2">Semester Genap 2023</Item>
            </Picker>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                        Total Sesi Bimbingan
                    </Text>
                    <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#1473E6' }}>
                        {totalSessions}
                    </Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                        Total Mahasiswa Dibimbing
                    </Text>
                    <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#0D7C0D' }}>
                        {totalMahasiswa}
                    </Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                        Rata-rata Response Rate
                    </Text>
                    <Text UNSAFE_style={{ fontSize: '32px', fontWeight: 700, color: '#D97706' }}>
                        {avgResponseRate}%
                    </Text>
                </div>
            </div>

            {/* SKP Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E1E1E1',
            }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #E1E1E1' }}>
                    <Flex alignItems="center" gap="size-100">
                        <UserGroup size="S" />
                        <Text UNSAFE_style={{ fontWeight: 600 }}>Detail SKP Dosen</Text>
                    </Flex>
                </div>

                {skpRecords.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                            Belum ada data SKP untuk periode ini.
                        </Text>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E1E1E1' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Dosen
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Total Sesi
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Mahasiswa
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Selesai
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Response Rate
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Avg Response
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {skpRecords.map((record) => (
                                <tr key={record.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Text UNSAFE_style={{ fontWeight: 500 }}>
                                            {record.dosen?.full_name || '-'}
                                        </Text>
                                        <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>
                                            {record.dosen?.nim_nidn || '-'}
                                        </Text>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <Text UNSAFE_style={{ fontWeight: 600, color: '#1473E6' }}>
                                            {record.total_sessions}
                                        </Text>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {record.total_mahasiswa}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            backgroundColor: '#E6FFE6',
                                            color: '#0D7C0D',
                                        }}>
                                            {record.completed_mahasiswa}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {record.response_rate}%
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        {record.avg_response_time_hours}h
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
