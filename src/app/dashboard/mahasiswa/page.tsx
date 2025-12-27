'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    SearchField,
    ActionButton,
    Text,
    Heading,
    Picker,
    Item,
} from '@adobe/react-spectrum';
import Add from '@spectrum-icons/workflow/Add';
import User from '@spectrum-icons/workflow/User';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import { getMahasiswaList } from '@/lib/api';

interface MahasiswaWithBimbingan {
    id: string;
    nim_nidn: string;
    full_name: string;
    email: string;
    angkatan: number | null;
    bimbingan: Array<{
        id: string;
        status: string;
        judul_skripsi: string | null;
        dosen: { id: string; full_name: string } | null;
    }>;
}

export default function MahasiswaPage() {
    const [mahasiswaList, setMahasiswaList] = useState<MahasiswaWithBimbingan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMahasiswaList({ search: searchQuery });
                setMahasiswaList(data);
            } catch (error) {
                console.error('Error fetching mahasiswa:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [searchQuery]);

    const getStatus = (bimbingan: MahasiswaWithBimbingan['bimbingan']) => {
        if (!bimbingan || bimbingan.length === 0) return 'unassigned';
        const active = bimbingan.find(b => b.status === 'active');
        if (active) return 'active';
        const completed = bimbingan.find(b => b.status === 'completed');
        if (completed) return 'completed';
        return 'unassigned';
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: '#E6FFE6', color: '#0D7C0D', text: 'Aktif' };
            case 'completed':
                return { bg: '#E6F2FF', color: '#1473E6', text: 'Selesai' };
            default:
                return { bg: '#FFF3E6', color: '#D97706', text: 'Belum Assign' };
        }
    };

    const filteredList = statusFilter === 'all'
        ? mahasiswaList
        : mahasiswaList.filter(m => getStatus(m.bimbingan) === statusFilter);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading mahasiswa...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Mahasiswa</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                        {mahasiswaList.length} mahasiswa terdaftar
                    </Text>
                </div>
                <ActionButton>
                    <Add />
                    <Text>Tambah Mahasiswa</Text>
                </ActionButton>
            </Flex>

            {/* Filters */}
            <Flex gap="size-200">
                <SearchField
                    label="Cari mahasiswa"
                    placeholder="Nama atau NIM..."
                    width="size-3600"
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
                <Picker
                    label="Status"
                    selectedKey={statusFilter}
                    onSelectionChange={(key) => setStatusFilter(key as string)}
                >
                    <Item key="all">Semua Status</Item>
                    <Item key="active">Aktif</Item>
                    <Item key="completed">Selesai</Item>
                    <Item key="unassigned">Belum Assign</Item>
                </Picker>
            </Flex>

            {/* Student List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E1E1E1',
            }}>
                {filteredList.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <User size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                        <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                            {mahasiswaList.length === 0
                                ? 'Belum ada data mahasiswa. Tambahkan mahasiswa melalui Supabase.'
                                : 'Tidak ada mahasiswa yang cocok dengan filter'}
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
                                    Angkatan
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Dosen Pembimbing
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6E6E6E' }}>
                                    Status
                                </th>
                                <th style={{ padding: '16px', width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((mhs) => {
                                const status = getStatus(mhs.bimbingan);
                                const statusStyle = getStatusStyle(status);
                                const activeBimbingan = mhs.bimbingan?.find(b => b.status === 'active');

                                return (
                                    <tr key={mhs.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                        <td style={{ padding: '16px' }}>
                                            <Flex alignItems="center" gap="size-150">
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#E6F2FF',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <User size="S" UNSAFE_style={{ color: '#1473E6' }} />
                                                </div>
                                                <div>
                                                    <Text UNSAFE_style={{ fontWeight: 500 }}>{mhs.full_name}</Text>
                                                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '13px' }}>
                                                        {mhs.nim_nidn}
                                                    </Text>
                                                </div>
                                            </Flex>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <Text>{mhs.angkatan || '-'}</Text>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <Text>{activeBimbingan?.dosen?.full_name || '-'}</Text>
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
                                        <td style={{ padding: '16px' }}>
                                            <ChevronRight size="S" UNSAFE_style={{ color: '#999' }} />
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
