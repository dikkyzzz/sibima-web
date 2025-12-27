'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    Heading,
    Picker,
    Item,
} from '@adobe/react-spectrum';
import User from '@spectrum-icons/workflow/User';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Clock from '@spectrum-icons/workflow/Clock';
import Alert from '@spectrum-icons/workflow/Alert';
import { getMilestonesWithStudent, getMahasiswaList } from '@/lib/api';

interface Milestone {
    id: string;
    milestone_type: string;
    status: string;
    notes: string | null;
    updated_at: string;
    bimbingan: {
        id: string;
        judul_skripsi: string | null;
        mahasiswa: { id: string; full_name: string; nim_nidn: string } | null;
        dosen: { id: string; full_name: string } | null;
    } | null;
}

const MILESTONE_ORDER = ['proposal', 'bab1', 'bab2', 'bab3', 'bab4', 'bab5', 'sidang'];
const MILESTONE_LABELS: Record<string, string> = {
    proposal: 'Proposal',
    bab1: 'BAB I',
    bab2: 'BAB II',
    bab3: 'BAB III',
    bab4: 'BAB IV',
    bab5: 'BAB V',
    sidang: 'Sidang',
};

export default function ProgressPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState<string>('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const [milestonesData, mahasiswaData] = await Promise.all([
                    getMilestonesWithStudent(),
                    getMahasiswaList(),
                ]);
                setMilestones(milestonesData);
                setMahasiswaList(mahasiswaData);
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved':
                return { bg: '#E6FFE6', color: '#0D7C0D', icon: <Checkmark size="XS" />, text: 'Disetujui' };
            case 'in_progress':
                return { bg: '#E6F2FF', color: '#1473E6', icon: <Clock size="XS" />, text: 'Dalam Proses' };
            case 'revision':
                return { bg: '#FEF3C7', color: '#D97706', icon: <Alert size="XS" />, text: 'Revisi' };
            default:
                return { bg: '#F5F5F5', color: '#6E6E6E', icon: <Clock size="XS" />, text: 'Pending' };
        }
    };

    // Group milestones by mahasiswa
    const groupedMilestones = milestones.reduce((acc, m) => {
        const mahasiswaId = m.bimbingan?.mahasiswa?.id || 'unknown';
        if (!acc[mahasiswaId]) {
            acc[mahasiswaId] = {
                mahasiswa: m.bimbingan?.mahasiswa || null,
                dosen: m.bimbingan?.dosen || null,
                judul: m.bimbingan?.judul_skripsi || null,
                milestones: [],
            };
        }
        acc[mahasiswaId].milestones.push(m);
        return acc;
    }, {} as Record<string, any>);

    const filteredGroups = selectedMahasiswa === 'all'
        ? Object.entries(groupedMilestones)
        : Object.entries(groupedMilestones).filter(([id]) => id === selectedMahasiswa);

    // Stats
    const approvedCount = milestones.filter(m => m.status === 'approved').length;
    const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
    const revisionCount = milestones.filter(m => m.status === 'revision').length;

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading progress...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div>
                <Heading level={1}>Progress Bimbingan</Heading>
                <Text UNSAFE_style={{ color: '#6E6E6E' }}>Tracking milestone mahasiswa</Text>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#0D7C0D' }}>
                        {approvedCount}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Disetujui</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#1473E6' }}>
                        {inProgressCount}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Dalam Proses</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#D97706' }}>
                        {revisionCount}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Revisi</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#333' }}>
                        {milestones.length}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Total</Text>
                </div>
            </div>

            {/* Filter */}
            <Picker
                label="Filter Mahasiswa"
                selectedKey={selectedMahasiswa}
                onSelectionChange={(key) => setSelectedMahasiswa(key as string)}
                width="size-3600"
            >
                <Item key="all">Semua Mahasiswa</Item>
                {mahasiswaList.map(m => (
                    <Item key={m.id}>{m.full_name}</Item>
                ))}
            </Picker>

            {/* Progress Cards */}
            {filteredGroups.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E1E1E1',
                    padding: '48px',
                    textAlign: 'center',
                }}>
                    <User size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                    <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                        Belum ada data progress. Milestone akan muncul saat bimbingan dimulai.
                    </Text>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredGroups.map(([mahasiswaId, data]) => (
                        <div
                            key={mahasiswaId}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #E1E1E1',
                                padding: '24px',
                            }}
                        >
                            {/* Student Info */}
                            <Flex alignItems="center" gap="size-200" marginBottom="size-300">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '#E6F2FF',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <User size="M" UNSAFE_style={{ color: '#1473E6' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text UNSAFE_style={{ fontWeight: 600, fontSize: '16px' }}>
                                        {data.mahasiswa?.full_name || 'Unknown'}
                                    </Text>
                                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '13px' }}>
                                        {data.mahasiswa?.nim_nidn} • Pembimbing: {data.dosen?.full_name || '-'}
                                    </Text>
                                    <Text UNSAFE_style={{ color: '#999', display: 'block', fontSize: '12px', marginTop: '4px' }}>
                                        {data.judul || 'Judul belum ditentukan'}
                                    </Text>
                                </div>
                            </Flex>

                            {/* Milestone Timeline */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {MILESTONE_ORDER.map((type) => {
                                    const milestone = data.milestones.find((m: Milestone) => m.milestone_type === type);
                                    const status = milestone?.status || 'pending';
                                    const style = getStatusStyle(status);

                                    return (
                                        <div
                                            key={type}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                backgroundColor: style.bg,
                                                border: `1px solid ${style.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <span style={{ color: style.color }}>{style.icon}</span>
                                            <Text UNSAFE_style={{ fontSize: '13px', color: style.color, fontWeight: 500 }}>
                                                {MILESTONE_LABELS[type]}
                                            </Text>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
