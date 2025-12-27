'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [mandatorySessions, setMandatorySessions] = useState(8);
    const [autoReminder, setAutoReminder] = useState(true);
    const [reminderDays, setReminderDays] = useState(1);

    const handleSave = () => {
        // TODO: Save to database
        alert('Pengaturan disimpan!');
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Pengaturan Sistem</h1>
                <p className="text-neutral-500">Konfigurasi aplikasi SIBIMA</p>
            </div>

            {/* Bimbingan Settings */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">⚙️ Pengaturan Bimbingan</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Jumlah Sesi Wajib per Semester
                        </label>
                        <input
                            type="number"
                            value={mandatorySessions}
                            onChange={(e) => setMandatorySessions(Number(e.target.value))}
                            className="w-32 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            min={1}
                            max={20}
                        />
                        <p className="text-sm text-neutral-400 mt-1">
                            Jumlah minimal sesi bimbingan yang harus dilakukan mahasiswa per semester
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">🔔 Pengaturan Notifikasi</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-neutral-800">Reminder Otomatis</p>
                            <p className="text-sm text-neutral-500">
                                Kirim reminder sebelum jadwal bimbingan
                            </p>
                        </div>
                        <button
                            onClick={() => setAutoReminder(!autoReminder)}
                            className={`w-12 h-6 rounded-full transition ${autoReminder ? 'bg-primary-600' : 'bg-neutral-300'
                                }`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition ${autoReminder ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    {autoReminder && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Kirim Reminder (hari sebelum)
                            </label>
                            <select
                                value={reminderDays}
                                onChange={(e) => setReminderDays(Number(e.target.value))}
                                className="w-32 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value={1}>1 hari</option>
                                <option value={2}>2 hari</option>
                                <option value={3}>3 hari</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Milestone Settings */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">📋 Tahapan Bimbingan</h2>
                <p className="text-sm text-neutral-500 mb-4">
                    Tahapan milestone yang akan digunakan untuk tracking progress mahasiswa
                </p>

                <div className="space-y-2">
                    {[
                        'Pengajuan Judul',
                        'Proposal',
                        'BAB I - Pendahuluan',
                        'BAB II - Tinjauan Pustaka',
                        'BAB III - Metodologi',
                        'BAB IV - Hasil & Pembahasan',
                        'BAB V - Kesimpulan',
                        'Sidang Proposal',
                        'Sidang Akhir',
                    ].map((milestone, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                        >
                            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                            </span>
                            <span className="text-neutral-700">{milestone}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition"
                >
                    Simpan Pengaturan
                </button>
            </div>
        </div>
    );
}
