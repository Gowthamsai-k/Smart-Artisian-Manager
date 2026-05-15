import { useState } from 'react';
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
import { IconAlertCircle, IconArrowRight, IconAnalyze } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/User';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        password: "",
    });

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
            // Note: Sending company name even if backend doesn't explicitly use it yet
            const response = await axios.post('http://localhost:3000/api/auth/signup', formData, { withCredentials: true });
            
            localStorage.setItem("token", response.data.token);
            
            dispatch(setUser({ name: formData.name, email: formData.email, token: response.data.token }));
            
            navigate('/');
        }
        catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
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
                    backgroundImage: 'url(https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=2000)',
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
                    background: 'linear-gradient(to top, rgba(85, 107, 47, 0.95) 0%, rgba(85, 107, 47, 0.3) 100%)',
                }}></div>

                <Box style={{ position: 'relative', zIndex: 1, padding: '4rem' }}>
                    <Title order={1} c="white" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1rem', fontWeight: 800 }}>
                        Master your<br />production flow.
                    </Title>
                    <Text c="white" size="lg" style={{ opacity: 0.9, maxWidth: '500px', lineHeight: 1.5 }}>
                        Join thousands of high-end artisans managing their inventory with surgical precision and effortless elegance.
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
                    maxWidth: '800px',
                }}
            >
                <div style={{ marginBottom: 'auto' }}>
                    <Group gap="xs">
                        <IconAnalyze color="#556B2F" size={24} stroke={2} />
                        <Text fw={900} size="xl" c="#556B2F" style={{ letterSpacing: '-0.5px', fontSize: '20px' }}>
                            ArtisanFlow
                        </Text>
                    </Group>
                </div>

                <Container size={440} w="100%" px={0} style={{ margin: 'auto' }}>
                    <Title order={2} fw={700} c="dark.8" mb="xs">
                        Create your account
                    </Title>
                    <Text c="dimmed" size="sm" mb={40}>
                        Begin your journey with the Inventory Precision System.
                    </Text>

                    {error && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Signup Failed" color="red" variant="light" mb="md" radius="sm">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label={
                                <Text fw={600} size="xs" c="dimmed" mb={4}>
                                    Full Name <span style={{ color: 'var(--mantine-color-red-filled)' }}>*</span>
                                </Text>
                            }
                            withAsterisk={false}
                            placeholder="Arthur Dent"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            size="md"
                            radius="sm"
                            mb="lg"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px', borderColor: '#e9ecef' } }}
                        />

                        <TextInput
                            label={
                                <Text fw={600} size="xs" c="dimmed" mb={4}>
                                    Work Email <span style={{ color: 'var(--mantine-color-red-filled)' }}>*</span>
                                </Text>
                            }
                            withAsterisk={false}
                            placeholder="name@company.com"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            size="md"
                            radius="sm"
                            mb="lg"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px', borderColor: '#e9ecef' } }}
                        />

                        <TextInput
                            label={
                                <Text fw={600} size="xs" c="dimmed" mb={4}>
                                    Company Name
                                </Text>
                            }
                            placeholder="Artisan Industries"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            size="md"
                            radius="sm"
                            mb="lg"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px', borderColor: '#e9ecef' } }}
                        />

                        <PasswordInput
                            label={
                                <Text fw={600} size="xs" c="dimmed" mb={4}>
                                    Password <span style={{ color: 'var(--mantine-color-red-filled)' }}>*</span>
                                </Text>
                            }
                            withAsterisk={false}
                            placeholder="••••••••"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            size="md"
                            radius="sm"
                            mb="xl"
                            disabled={loading}
                            styles={{ input: { fontSize: '14px', borderColor: '#e9ecef' } }}
                        />

                        <Checkbox 
                            label={
                                <Text size="xs" c="dimmed" fw={500}>
                                    I agree to the <Anchor href="#" c="#556B2F" fw={600}>Terms of Service</Anchor> and <Anchor href="#" c="#556B2F" fw={600}>Privacy Policy</Anchor>.
                                </Text>
                            } 
                            size="xs" 
                            color="#556B2F" 
                            mt="sm" 
                            mb="xl" 
                            required
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
                            Create Account
                        </Button>
                    </form>

                    <Divider my="xl" color="gray.2" />

                    <Group justify="space-between" align="center">
                        <Text size="sm" c="dimmed">
                            Already have an account?
                        </Text>
                        <Button 
                            component={Link} 
                            to="/login" 
                            variant="default" 
                            radius="xl" 
                            size="sm"
                            styles={{ root: { borderColor: '#adb5bd', color: '#495057', minWidth: '100px' } }}
                        >
                            Log in
                        </Button>
                    </Group>
                </Container>

                <div style={{ marginTop: 'auto', textAlign: 'right' }}>
                    <Text size="10px" c="gray.4" fw={700} style={{ letterSpacing: '1px' }}>
                        EST. 2024
                    </Text>
                </div>
            </Box>
        </Box>
    );
};

export default Signup;