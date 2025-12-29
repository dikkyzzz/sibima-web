'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    Heading,
    Divider,
    Content,
    ButtonGroup,
    Button,
    Form,
    TextField,
    Picker,
    Item,
    DialogContainer,
} from '@adobe/react-spectrum';
import { User } from '@/lib/types';
import { upsertUser } from '@/lib/api';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user?: Partial<User> | null;
    defaultRole: 'mahasiswa' | 'dosen';
}

export default function UserModal({ isOpen, onClose, onSuccess, user, defaultRole }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        full_name: '',
        nim_nidn: '',
        email: '',
        role: defaultRole,
        angkatan: undefined,
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                full_name: '',
                nim_nidn: '',
                email: '',
                role: defaultRole,
                angkatan: undefined,
            });
        }
    }, [user, defaultRole]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await upsertUser(formData);
            onSuccess();
            onClose();
        } catch (error) {
            alert('Gagal menyimpan data user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContainer onDismiss={onClose}>
            {isOpen ? (
                <Dialog>
                    <Heading>{user?.id ? 'Edit' : 'Tambah'} {defaultRole === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}</Heading>
                    <Divider />
                    <Content>
                        <Form isDisabled={loading}>
                            <TextField
                                label="Nama Lengkap"
                                value={formData.full_name}
                                onChange={(val) => setFormData({ ...formData, full_name: val })}
                                isRequired
                                autoFocus
                            />
                            <TextField
                                label={defaultRole === 'mahasiswa' ? 'NIM' : 'NIP/NIDN'}
                                value={formData.nim_nidn}
                                onChange={(val) => setFormData({ ...formData, nim_nidn: val })}
                                isRequired
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(val) => setFormData({ ...formData, email: val })}
                                isRequired
                            />

                            <TextField
                                label="Angkatan"
                                type="number"
                                value={formData.angkatan?.toString()}
                                onChange={(val) => setFormData({ ...formData, angkatan: parseInt(val) || undefined })}
                                isHidden={defaultRole !== 'mahasiswa'}
                            />

                            <Picker
                                label="Role"
                                selectedKey={formData.role ?? defaultRole}
                                onSelectionChange={(key) => setFormData({ ...formData, role: key as any })}
                                isRequired
                            >
                                <Item key="mahasiswa">Mahasiswa</Item>
                                <Item key="dosen">Dosen</Item>
                                <Item key="admin_tu">Admin TU</Item>
                            </Picker>
                        </Form>
                    </Content>
                    <ButtonGroup>
                        <Button variant="secondary" onPress={onClose} isDisabled={loading}>Batal</Button>
                        <Button variant="accent" onPress={handleSubmit} isDisabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </ButtonGroup>
                </Dialog>
            ) : null}
        </DialogContainer>
    );
}
