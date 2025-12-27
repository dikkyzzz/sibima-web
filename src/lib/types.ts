// TypeScript types for SIBIMA Web Dashboard

export interface User {
    id: string;
    nim_nidn: string;
    email: string;
    full_name: string;
    role: 'mahasiswa' | 'dosen' | 'admin_tu' | 'super_admin';
    phone?: string;
    avatar_url?: string;
    prodi_id?: number;
    angkatan?: number;
    created_at: string;
    updated_at: string;
}

export interface Bimbingan {
    id: string;
    mahasiswa_id: string;
    dosen_id: string;
    judul_skripsi?: string;
    status: 'active' | 'completed' | 'cancelled';
    started_at?: string;
    completed_at?: string;
    created_at: string;
    mahasiswa?: User;
    dosen?: User;
    milestones?: Milestone[];
    schedules?: Schedule[];
}

export interface Message {
    id: string;
    bimbingan_id: string;
    sender_id: string;
    content: string;
    message_type: 'text' | 'image' | 'document';
    attachment_url?: string;
    is_read: boolean;
    read_at?: string;
    reply_to_id?: string;
    created_at: string;
    sender?: User;
}

export interface Schedule {
    id: string;
    bimbingan_id: string;
    requested_by: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    location?: string;
    is_mandatory: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    requester?: User;
}

export interface Milestone {
    id: string;
    bimbingan_id: string;
    milestone_type: string;
    status: 'pending' | 'in_progress' | 'revision' | 'approved';
    notes?: string;
    updated_by?: string;
    updated_at: string;
}

export interface Document {
    id: string;
    bimbingan_id: string;
    uploaded_by: string;
    file_name: string;
    file_url: string;
    file_size: number;
    version: number;
    milestone_type?: string;
    created_at: string;
}

export interface SKPRecord {
    id: string;
    dosen_id: string;
    periode: string;
    total_sessions: number;
    total_mahasiswa: number;
    completed_mahasiswa: number;
    response_rate: number;
    avg_response_time_hours: number;
    created_at: string;
    dosen?: User;
}

export interface DashboardStats {
    totalMahasiswa: number;
    totalDosen: number;
    activeBimbingan: number;
    completedBimbingan: number;
    onTrackStudents: number;
    delayedStudents: number;
    atRiskStudents: number;
    avgSessionsPerStudent: number;
}
