import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Box,
  Alert
} from '@mantine/core';
import { IconMail, IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
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
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', formData, { withCredentials: true });
            
            localStorage.setItem("token", response.data.token);
            
            // Dispatch to Redux to update global auth state
            dispatch(setUser({ name: formData.name, email: formData.email, token: response.data.token }));
            
            // Map to home page as requested
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
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E6E6FA', // Lavender fallback
                backgroundImage: 'linear-gradient(135deg, #87CEEB 0%, #E6E6FA 100%)', // Sky Blue to Lavender
            }}
            py="xl"
        >
            <Container size={420} w="100%">
                <Title
                    ta="center"
                    fw={900}
                    c="blue.7"
                    style={{
                        fontFamily: 'Greycliff CF, var(--mantine-font-family)',
                        letterSpacing: '-1px'
                    }}
                >
                    Smart Artisan
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have an account?{' '}
                    <Anchor component={Link} to="/login" size="sm" fw={600}>
                        Sign in
                    </Anchor>
                </Text>

                <Paper 
                    withBorder 
                    shadow="xl" 
                    p={40} 
                    mt={30} 
                    radius="md"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Title order={3} ta="center" mb="xl" fw={700}>
                        Create Account
                    </Title>

                    {error && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Signup Failed" color="red" variant="light" mb="md" radius="md">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextInput
                            label="Full Name"
                            placeholder="John Doe"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            leftSection={<IconUser size={16} />}
                            size="md"
                            radius="md"
                            mb="md"
                            disabled={loading}
                        />

                        <TextInput
                            label="Email Address"
                            placeholder="name@company.com"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            leftSection={<IconMail size={16} />}
                            size="md"
                            radius="md"
                            mb="md"
                            disabled={loading}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            leftSection={<IconLock size={16} />}
                            size="md"
                            radius="md"
                            mb="xl"
                            disabled={loading}
                        />

                        <Button 
                            fullWidth 
                            mt="xl" 
                            size="md" 
                            radius="md"
                            type="submit"
                            loading={loading}
                            variant="gradient"
                            gradient={{ from: 'blue.6', to: 'cyan.5', deg: 45 }}
                            fw={600}
                        >
                            Sign Up
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;