import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Title,
    Text,
    Container,
    Group,
    Button,
    Box,
    Alert,
    Divider,
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle, IconArrowRight, IconBrandGoogle, IconDeviceDesktopAnalytics, IconAnalyze } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/User';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emailInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Keyboard shortcut for email focus
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
                e.preventDefault();
                emailInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true });

            localStorage.setItem("token", response.data.token);

            dispatch(setUser({ email: formData.email, token: response.data.token }));

            navigate('/');
        }
        catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                backgroundColor: '#ffffff',
            }}
        >
            {/* Left Panel - Image Background */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    position: 'relative',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=2000)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                visibleFrom="md" // Hide on smaller screens
            >
                {/* Olive Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(85, 107, 47, 0.95) 0%, rgba(85, 107, 47, 0.4) 100%)',
                }}></div>

                <Box style={{ position: 'relative', zIndex: 1, padding: '4rem' }}>
                    <Title order={1} c="white" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1rem', fontWeight: 800 }}>
                        Mastery in Every<br />Movement.
                    </Title>
                    <Text c="white" size="lg" style={{ opacity: 0.9, maxWidth: '500px', lineHeight: 1.5 }}>
                        The Inventory Precision System designed for the modern creator. Manage your flow with ArtisanFlow.
                    </Text>
                </Box>
            </Box>

            {/* Right Panel - Form */}
            <Box
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    maxWidth: '800px', // Prevent it from stretching too far on ultrawide
                }}
            >
                <div style={{ marginBottom: 'auto' }}>
                    <Group gap="xs">
                        <IconAnalyze color="#556B2F" size={28} stroke={2} />
                        <Text fw={900} size="xl" c="#556B2F" style={{ letterSpacing: '-0.5px', fontSize: '24px' }}>
                            ArtisanFlow
                        </Text>
                    </Group>
                </div>

                <Container size={440} w="100%" px={0} style={{ margin: 'auto' }}>
                    <Title order={2} fw={700} c="dark.8" mb="xs">
                        Welcome Back
                    </Title>
                    <Text c="dimmed" size="sm" mb={30}>
                        Please enter your credentials to access your dashboard.
                    </Text>

                    {error && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Login Failed" color="red" variant="light" mb="md" radius="sm">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextInput
                            ref={emailInputRef}
                            label={
                                <Text fw={600} size="xs" c="dimmed" mb={4}>
                                    Email Address <span style={{ color: 'var(--mantine-color-red-filled)' }}>*</span>
                                </Text>
                            }
                            withAsterisk={false}
                            placeholder="name@artisanflow.com"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            leftSection={<IconMail size={16} stroke={1.5} color="#adb5bd" />}
                            size="md"
                            radius="sm"
                            mb="md"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px' } }}
                        />

                        <PasswordInput
                            label={
                                <Group justify="space-between" align="center" style={{ width: '100%' }} mb={4}>
                                    <Text fw={600} size="xs" c="dimmed">
                                        Password <span style={{ color: 'var(--mantine-color-red-filled)' }}>*</span>
                                    </Text>
                                    <Anchor size="xs" fw={600} c="#556B2F" style={{ textDecoration: 'none' }}>
                                        Forgot password?
                                    </Anchor>
                                </Group>
                            }
                            withAsterisk={false}
                            placeholder="••••••••"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            leftSection={<IconLock size={16} stroke={1.5} color="#adb5bd" />}
                            size="md"
                            radius="sm"
                            mb="md"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px' } }}
                        />

                        <Checkbox
                            label={<Text size="xs" c="dimmed" fw={500}>Remember this device</Text>}
                            size="xs"
                            color="#556B2F"
                            mt="sm"
                            mb="xl"
                        />

                        <Button
                            fullWidth
                            size="md"
                            radius="sm"
                            type="submit"
                            loading={loading}
                            color="#556B2F"
                            fw={600}
                            rightSection={!loading && <IconArrowRight size={16} />}
                            style={{ backgroundColor: '#556B2F' }}
                        >
                            Sign In
                        </Button>
                    </form>




                    <Text ta="center" size="sm" c="dimmed" mt="xl">
                        Don't have an account?{' '}
                        <Anchor component={Link} to="/signup" fw={700} c="#556B2F" style={{ textDecoration: 'none' }}>
                            Create an account
                        </Anchor>
                    </Text>
                </Container>

                <div style={{ marginTop: 'auto', textAlign: 'right' }}>
                    <Text size="8px" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ArtisanFlow v4.2 — Inventory Precision System
                    </Text>
                </div>
            </Box>
        </Box>
    );
};

export default Login;