'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    View,
    Flex,
    TextField,
    Button,
    Heading,
    Text,
    Form,
    ProgressCircle,
} from '@adobe/react-spectrum';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #1473E6 0%, #0D66D0 100%)'
        }}>
            {/* Left Branding Panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '32px',
                color: 'white',
            }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    {/* Logo */}
                    <img
                        src="/logo.png"
                        alt="SIBIMA Logo"
                        style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '24px',
                            margin: '0 auto 20px',
                            objectFit: 'contain',
                        }}
                    />

                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        marginBottom: '4px',
                        fontFamily: 'Adobe Clean, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
                    }}>
                        SIBIMA
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '24px',
                        fontFamily: 'Adobe Clean, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
                    }}>
                        Sistem Bimbingan Mahasiswa
                    </p>

                    {/* Features */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📊</div>
                            <p style={{ fontSize: '11px', opacity: 0.8 }}>Monitoring</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📅</div>
                            <p style={{ fontSize: '11px', opacity: 0.8 }}>Penjadwalan</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📋</div>
                            <p style={{ fontSize: '11px', opacity: 0.8 }}>Laporan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Login Panel */}
            <div style={{
                width: '480px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
            }}>
                <View width="100%" maxWidth="size-4600">
                    <Heading level={1} marginBottom="size-100">
                        Selamat Datang
                    </Heading>
                    <Text UNSAFE_style={{ color: '#6E6E6E', display: 'block', marginBottom: '32px' }}>
                        Masuk ke dashboard admin
                    </Text>

                    {error && (
                        <View
                            backgroundColor="negative"
                            padding="size-200"
                            borderRadius="regular"
                            marginBottom="size-300"
                        >
                            <Text UNSAFE_style={{ color: 'white' }}>{error}</Text>
                        </View>
                    )}

                    <Form onSubmit={handleLogin}>
                        <Flex direction="column" gap="size-200">
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                isRequired
                                width="100%"
                                placeholder="admin@kampus.ac.id"
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={setPassword}
                                isRequired
                                width="100%"
                                placeholder="••••••••"
                            />

                            <Button
                                variant="accent"
                                type="submit"
                                isDisabled={isLoading}
                                width="100%"
                                marginTop="size-200"
                            >
                                {isLoading ? (
                                    <Flex alignItems="center" gap="size-100">
                                        <ProgressCircle size="S" isIndeterminate aria-label="Loading" />
                                        <Text>Memproses...</Text>
                                    </Flex>
                                ) : (
                                    'Masuk'
                                )}
                            </Button>
                        </Flex>
                    </Form>

                    <Text
                        UNSAFE_style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '48px',
                            fontSize: '12px',
                            color: '#B3B3B3'
                        }}
                    >
                        © 2024 SIBIMA - Sistem Bimbingan Mahasiswa
                    </Text>
                </View>
            </div>
        </div>
    );
}
