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
import Calendar from '@spectrum-icons/workflow/Calendar';
import User from '@spectrum-icons/workflow/User';
import { getBimbinganList, getDosenList, getMahasiswaList, assignBimbingan } from '@/lib/api';

interface Bimbingan {
    id: string;
    status: string;
    judul_skripsi: string | null;
    started_at: string;
    mahasiswa: { id: string; full_name: string; nim_nidn: string } | null;
    dosen: { id: string; full_name: string } | null;
}

export default function BimbinganPage() {
    const [bimbinganList, setBimbinganList] = useState<Bimbingan[]>([]);
    const [dosenList, setDosenList] = useState<any[]>([]);
    const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showAssignModal, setShowAssignModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [bimbingan, dosen, mahasiswa] = await Promise.all([
                    getBimbinganList(),
                    getDosenList(),
                    getMahasiswaList(),
                ]);
                setBimbinganList(bimbingan);
                setDosenList(dosen);
                setMahasiswaList(mahasiswa);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: '#E6FFE6', color: '#0D7C0D', text: 'Aktif' };
            case 'completed':
                return { bg: '#E6F2FF', color: '#1473E6', text: 'Selesai' };
            case 'cancelled':
                return { bg: '#FFE6E6', color: '#D91A1A', text: 'Dibatalkan' };
            default:
                return { bg: '#F5F5F5', color: '#6E6E6E', text: status };
        }
    };

    const filteredList = statusFilter === 'all'
        ? bimbinganList
        : bimbinganList.filter(b => b.status === statusFilter);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading bimbingan...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Bimbingan</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                        {bimbinganList.length} total bimbingan
                    </Text>
                </div>
                <ActionButton onPress={() => setShowAssignModal(true)}>
                    <Calendar />
                    <Text>Assign Bimbingan</Text>
                </ActionButton>
            </Flex>

            {/* Filters */}
            <Picker
                label="Status"
                selectedKey={statusFilter}
                onSelectionChange={(key) => setStatusFilter(key as string)}
                width="size-2400"
            >
                <Item key="all">Semua Status</Item>
                <Item key="active">Aktif</Item>
                <Item key="completed">Selesai</Item>
                <Item key="cancelled">Dibatalkan</Item>
            </Picker>

            {/* Bimbingan List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E1E1E1',
            }}>
                {filteredList.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <Calendar size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                        <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                            {bimbinganList.length === 0
                                ? 'Belum ada data bimbingan. Assign mahasiswa ke dosen untuk memulai.'
                                : 'Tidak ada bimbingan yang cocok dengan filter'}
                        </Text>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E1E1E1' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Mahasiswa
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Dosen Pembimbing
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Judul
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Mulai
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((bimbingan) => {
                                const statusStyle = getStatusStyle(bimbingan.status);

                                return (
                                    <tr key={bimbingan.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                        <td style={{ padding: '16px' }}>
                                            <Flex alignItems="center" gap="size-150">
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    backgroundColor: '#E6F2FF',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <User size="S" UNSAFE_style={{ color: '#1473E6' }} />
                                                </div>
                                                <div>
                                                    <Text UNSAFE_style={{ fontWeight: 500 }}>
                                                        {bimbingan.mahasiswa?.full_name || '-'}
                                                    </Text>
                                                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>
                                                        {bimbingan.mahasiswa?.nim_nidn || '-'}
                                                    </Text>
                                                </div>
                                            </Flex>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <Text>{bimbingan.dosen?.full_name || '-'}</Text>
                                        </td>
                                        <td style={{ padding: '16px', maxWidth: '200px' }}>
                                            <Text UNSAFE_style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'block',
                                            }}>
                                                {bimbingan.judul_skripsi || 'Belum ditentukan'}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px' }}>
                                                {bimbingan.started_at
                                                    ? new Date(bimbingan.started_at).toLocaleDateString('id-ID')
                                                    : '-'}
                                            </Text>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '999px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                            }}>
                                                {statusStyle.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
