'use client';

import { useEffect, useState } from 'react';
import {
    Flex,
    ActionButton,
    Text,
    Heading,
    SearchField,
} from '@adobe/react-spectrum';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import Download from '@spectrum-icons/workflow/Download';
import Document from '@spectrum-icons/workflow/Document';
import { getDocuments } from '@/lib/api';

interface DocumentItem {
    id: string;
    file_name: string;
    file_url: string;
    file_size: number | null;
    version: number;
    milestone_type: string | null;
    created_at: string;
    uploader: { id: string; full_name: string } | null;
    bimbingan: { mahasiswa: { full_name: string } | null } | null;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDocuments();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📑';
            default:
                return '📁';
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploader?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Text>Loading documents...</Text>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center">
                <div>
                    <Heading level={1}>Dokumen</Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E' }}>
                        {documents.length} dokumen ({formatFileSize(totalSize)})
                    </Text>
                </div>
                <ActionButton>
                    <FolderOpen />
                    <Text>Upload</Text>
                </ActionButton>
            </Flex>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#1473E6' }}>
                        {documents.length}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Total Dokumen</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#0D7C0D' }}>
                        {documents.filter(d => d.file_name.endsWith('.pdf')).length}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>PDF</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#7C3AED' }}>
                        {documents.filter(d => d.file_name.endsWith('.docx') || d.file_name.endsWith('.doc')).length}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Word</Text>
                </div>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #E1E1E1',
                    textAlign: 'center',
                }}>
                    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 700, color: '#D97706' }}>
                        {formatFileSize(totalSize)}
                    </Text>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', fontSize: '12px' }}>Total Size</Text>
                </div>
            </div>

            {/* Search */}
            <SearchField
                label="Cari dokumen"
                placeholder="Nama file atau uploader..."
                width="size-3600"
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {/* Documents Grid */}
            {filteredDocuments.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #E1E1E1',
                    padding: '48px',
                    textAlign: 'center',
                }}>
                    <Document size="XXL" UNSAFE_style={{ color: '#ccc' }} />
                    <Text UNSAFE_style={{ display: 'block', marginTop: '16px', color: '#6E6E6E' }}>
                        {documents.length === 0
                            ? 'Belum ada dokumen. Upload dokumen untuk memulai.'
                            : 'Tidak ada dokumen yang cocok dengan pencarian'}
                    </Text>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {filteredDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #E1E1E1',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Flex alignItems="start" gap="size-150" marginBottom="size-200">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                }}>
                                    {getFileIcon(doc.file_name)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text UNSAFE_style={{
                                        fontWeight: 500,
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {doc.file_name}
                                    </Text>
                                    <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '12px', display: 'block' }}>
                                        {formatFileSize(doc.file_size)} • v{doc.version}
                                    </Text>
                                </div>
                            </Flex>

                            <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: '12px' }}>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <div>
                                        <Text UNSAFE_style={{ color: '#6E6E6E', fontSize: '11px', display: 'block' }}>
                                            {doc.uploader?.full_name || '-'}
                                        </Text>
                                        <Text UNSAFE_style={{ color: '#999', fontSize: '11px' }}>
                                            {formatDate(doc.created_at)}
                                        </Text>
                                    </div>
                                    <ActionButton isQuiet>
                                        <Download size="S" />
                                    </ActionButton>
                                </Flex>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
