import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
  Alert
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/User';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
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
            const response = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true });
            
            localStorage.setItem("token", response.data.token);
            
            // Dispatch to Redux to update global auth state
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
                    Do not have an account yet?{' '}
                    <Anchor component={Link} to="/signup" size="sm" fw={600}>
                        Create account
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
                        Welcome Back
                    </Title>

                    {error && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Login Failed" color="red" variant="light" mb="md" radius="md">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
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
                            mb="md"
                            disabled={loading}
                        />

                        <Group justify="space-between" mt="md" mb="xl">
                            <Checkbox label="Remember me" size="sm" color="blue" />
                            <Anchor component="button" type="button" size="sm" c="blue.6" fw={500}>
                                Forgot password?
                            </Anchor>
                        </Group>

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
                            Sign In
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;