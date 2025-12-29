'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    SearchField,
    ActionButton,
    Text,
    Heading,
} from '@adobe/react-spectrum';
import Download from '@spectrum-icons/workflow/Download';
import User from '@spectrum-icons/workflow/User';
import Add from '@spectrum-icons/workflow/Add';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import { getDosenList, deleteUser } from '@/lib/api';
import UserModal from '@/components/UserModal';
import { User as UserType } from '@/lib/types';

interface DosenWithBimbingan {
    id: string;
    nim_nidn: string;
    full_name: string;
    email: string;
    bimbingan: Array<{ count: number }>;
}

export default function DosenPage() {
    const [dosenList, setDosenList] = useState<DosenWithBimbingan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Partial<UserType> | null>(null);

    async function fetchData() {
        setLoading(true);
        try {
            const data = await getDosenList(searchQuery);
            setDosenList(data);
        } catch (error) {
            console.error('Error fetching dosen:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: DosenWithBimbingan) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Yakin ingin menghapus dosen ini?')) {
            try {
                await deleteUser(id);
                fetchData();
            } catch (error) {
                alert('Gagal menghapus user');
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading dosen...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Dosen Pembimbing</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                        {dosenList.length} dosen terdaftar
                    </Text>
                </div>
                <Flex gap="size-150">
                    <ActionButton onPress={handleAdd}>
                        <Add />
                        <Text>Tambah Dosen</Text>
                    </ActionButton>
                    <ActionButton>
                        <Download />
                        <Text>Export</Text>
                    </ActionButton>
                </Flex>
            </Flex>

            {/* Search */}
            <SearchField
                label="Cari dosen"
                placeholder="Nama atau NIDN..."
                width="size-3600"
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* Dosen Grid */}
            {dosenList.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E1E1E1',
                    padding: '48px',
                    textAlign: 'center',
                }}>
                    <User size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                    <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                        Belum ada data dosen. Tambahkan dosen melalui Supabase.
                    </Text>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {dosenList.map((dosen) => {
                        const bimbinganCount = dosen.bimbingan?.[0]?.count || 0;

                        return (
                            <div
                                key={dosen.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #E1E1E1',
                                    padding: '24px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                }}
                                onClick={() => handleEdit(dosen)}
                            >
                                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                                    <ActionButton isQuiet onPress={() => handleEdit(dosen)}>
                                        <Edit size="S" />
                                    </ActionButton>
                                    <ActionButton isQuiet onPress={(e) => handleDelete(e as any, dosen.id)}>
                                        <Delete size="S" />
                                    </ActionButton>
                                </div>
                                <Flex alignItems="center" gap="size-200" marginBottom="size-200">
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        backgroundColor: '#E6FFE6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <User size="M" UNSAFE_style={{ color: '#0D7C0D' }} />
                                    </div>
                                    <div>
                                        <Text UNSAFE_style={{ fontWeight: 600, display: 'block' }}>
                                            {dosen.full_name}
                                        </Text>
                                        <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '13px' }}>
                                            {dosen.nim_nidn}
                                        </Text>
                                    </div>
                                </Flex>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    borderTop: '1px solid #F5F5F5',
                                    paddingTop: '16px',
                                }}>
                                    <div>
                                        <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '12px', display: 'block' }}>
                                            Mahasiswa
                                        </Text>
                                        <Text UNSAFE_style={{ fontWeight: 600, color: '#1473E6' }}>
                                            {bimbinganCount}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '12px', display: 'block' }}>
                                            Email
                                        </Text>
                                        <Text UNSAFE_style={{ fontSize: '12px', color: '#333' }}>
                                            {dosen.email?.split('@')[0] || '-'}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                user={selectedUser}
                defaultRole="dosen"
            />
        </div>
    );
}
