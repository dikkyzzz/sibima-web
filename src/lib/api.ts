import { createClient } from './supabase/client';
import { User, Bimbingan, Schedule, SKPRecord, DashboardStats } from './types';

const supabase = createClient();

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
    // Get total mahasiswa
    const { count: totalMahasiswa } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'mahasiswa');

    // Get total dosen
    const { count: totalDosen } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'dosen');

    // Get active bimbingan
    const { count: activeBimbingan } = await supabase
        .from('bimbingan')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    // Get completed bimbingan
    const { count: completedBimbingan } = await supabase
        .from('bimbingan')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

    // Get schedule stats
    const { count: totalSessions } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

    const avgSessions = activeBimbingan && totalSessions
        ? totalSessions / activeBimbingan
        : 0;

    // For student status, we'll calculate based on milestone progress
    // This is simplified - in production, you'd have more complex logic
    return {
        totalMahasiswa: totalMahasiswa || 0,
        totalDosen: totalDosen || 0,
        activeBimbingan: activeBimbingan || 0,
        completedBimbingan: completedBimbingan || 0,
        onTrackStudents: Math.floor((activeBimbingan || 0) * 0.7),
        delayedStudents: Math.floor((activeBimbingan || 0) * 0.2),
        atRiskStudents: Math.floor((activeBimbingan || 0) * 0.1),
        avgSessionsPerStudent: parseFloat(avgSessions.toFixed(1)),
    };
}

// ============================================
// MAHASISWA
// ============================================

export async function getMahasiswaList(filters?: {
    search?: string;
    status?: string;
    angkatan?: number;
}) {
    let query = supabase
        .from('users')
        .select(`
      *,
      bimbingan:bimbingan!mahasiswa_id(
        id,
        status,
        judul_skripsi,
        dosen:dosen_id(id, full_name)
      )
    `)
        .eq('role', 'mahasiswa')
        .order('full_name');

    if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,nim_nidn.ilike.%${filters.search}%`);
    }

    if (filters?.angkatan) {
        query = query.eq('angkatan', filters.angkatan);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching mahasiswa:', error);
        return [];
    }

    return data || [];
}

export async function getMahasiswaById(id: string) {
    const { data, error } = await supabase
        .from('users')
        .select(`
      *,
      bimbingan:bimbingan!mahasiswa_id(
        *,
        dosen:dosen_id(*),
        milestones(*),
        schedules(*)
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching mahasiswa:', error);
        return null;
    }

    return data;
}

// ============================================
// DOSEN
// ============================================

export async function getDosenList(search?: string) {
    let query = supabase
        .from('users')
        .select(`
      *,
      bimbingan:bimbingan!dosen_id(count)
    `)
        .eq('role', 'dosen')
        .order('full_name');

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,nim_nidn.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching dosen:', error);
        return [];
    }

    return data || [];
}

export async function getDosenById(id: string) {
    const { data, error } = await supabase
        .from('users')
        .select(`
      *,
      bimbingan:bimbingan!dosen_id(
        *,
        mahasiswa:mahasiswa_id(*)
      ),
      skp_records(*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching dosen:', error);
        return null;
    }

    return data;
}

export async function getDosenSKP(dosenId: string, periode: string): Promise<SKPRecord | null> {
    const { data, error } = await supabase
        .from('skp_records')
        .select('*')
        .eq('dosen_id', dosenId)
        .eq('periode', periode)
        .single();

    if (error) {
        return null;
    }

    return data;
}

// ============================================
// BIMBINGAN
// ============================================

export async function getBimbinganList(filters?: {
    status?: string;
    dosenId?: string;
}) {
    let query = supabase
        .from('bimbingan')
        .select(`
      *,
      mahasiswa:mahasiswa_id(*),
      dosen:dosen_id(*)
    `)
        .order('created_at', { ascending: false });

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    if (filters?.dosenId) {
        query = query.eq('dosen_id', filters.dosenId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching bimbingan:', error);
        return [];
    }

    return data || [];
}

export async function assignBimbingan(mahasiswaId: string, dosenId: string) {
    const { data, error } = await supabase
        .from('bimbingan')
        .insert({
            mahasiswa_id: mahasiswaId,
            dosen_id: dosenId,
            status: 'active',
        })
        .select()
        .single();

    if (error) {
        console.error('Error assigning bimbingan:', error);
        return null;
    }

    return data;
}

// ============================================
// SKP REPORTS
// ============================================

export async function getSKPReports(periode: string) {
    const { data, error } = await supabase
        .from('skp_records')
        .select(`
      *,
      dosen:dosen_id(*)
    `)
        .eq('periode', periode)
        .order('total_sessions', { ascending: false });

    if (error) {
        console.error('Error fetching SKP reports:', error);
        return [];
    }

    return data || [];
}

export async function generateSKPReport(dosenId: string, periode: string) {
    // Calculate SKP metrics from bimbingan data
    const { data: bimbingan } = await supabase
        .from('bimbingan')
        .select(`
      id,
      status,
      schedules(status),
      messages(sender_id, created_at, is_read)
    `)
        .eq('dosen_id', dosenId);

    if (!bimbingan) return null;

    const totalMahasiswa = bimbingan.length;
    const completedMahasiswa = bimbingan.filter(b => b.status === 'completed').length;

    let totalSessions = 0;
    bimbingan.forEach(b => {
        if (b.schedules) {
            totalSessions += b.schedules.filter((s: any) => s.status === 'completed').length;
        }
    });

    // Calculate response rate (simplified)
    const responseRate = 95; // Would need more complex calculation in production
    const avgResponseTime = 2; // hours

    // Upsert the SKP record
    const { data, error } = await supabase
        .from('skp_records')
        .upsert({
            dosen_id: dosenId,
            periode,
            total_sessions: totalSessions,
            total_mahasiswa: totalMahasiswa,
            completed_mahasiswa: completedMahasiswa,
            response_rate: responseRate,
            avg_response_time_hours: avgResponseTime,
        })
        .select()
        .single();

    if (error) {
        console.error('Error generating SKP report:', error);
        return null;
    }

    return data;
}

// ============================================
// RECENT ACTIVITY
// ============================================

export async function getRecentActivity(limit = 10) {
    // Get recent messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(limit);

    // Get recent schedule changes
    const { data: schedules } = await supabase
        .from('schedules')
        .select('*, requester:requested_by(full_name)')
        .order('created_at', { ascending: false })
        .limit(limit);

    // Combine and sort by time
    const activities = [
        ...(messages?.map(m => ({
            id: m.id,
            type: 'message' as const,
            user: m.sender?.full_name || 'Unknown',
            action: 'Mengirim pesan',
            time: m.created_at,
        })) || []),
        ...(schedules?.map(s => ({
            id: s.id,
            type: 'schedule' as const,
            user: s.requester?.full_name || 'Unknown',
            action: s.status === 'pending' ? 'Request jadwal bimbingan' : `Jadwal ${s.status}`,
            time: s.created_at,
        })) || []),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, limit);

    return activities;
}

// ============================================
// MILESTONES / PROGRESS
// ============================================

export async function getMilestonesWithStudent() {
    const { data, error } = await supabase
        .from('milestones')
        .select(`
            *,
            bimbingan:bimbingan_id(
                id,
                judul_skripsi,
                mahasiswa:mahasiswa_id(id, full_name, nim_nidn),
                dosen:dosen_id(id, full_name)
            )
        `)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching milestones:', error);
        return [];
    }

    return data || [];
}

export async function getDocuments() {
    const { data, error } = await supabase
        .from('documents')
        .select(`
            *,
            uploader:uploaded_by(id, full_name),
            bimbingan:bimbingan_id(
                mahasiswa:mahasiswa_id(full_name)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching documents:', error);
        return [];
    }

    return data || [];
}

// ============================================
// USER MANAGEMENT (ADMIN)
// ============================================

export async function upsertUser(user: Partial<User>) {
    const { data, error } = await supabase
        .from('users')
        .upsert({
            ...user,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting user:', error);
        throw error;
    }

    return data;
}

export async function deleteUser(id: string) {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting user:', error);
        throw error;
    }

    return true;
}

