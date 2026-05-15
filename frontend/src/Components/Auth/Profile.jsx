import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Paper, 
    Title, 
    Text, 
    Avatar, 
    Group, 
    Stack, 
    Divider, 
    Badge,
    Button,
    Box
} from '@mantine/core';
import { IconUser, IconMail, IconCalendar, IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data.success) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload(); // Ensure sidebar and layout update
    };

    if (!user) return <Text ta="center" mt="xl">Loading profile...</Text>;

    return (
        <Container size="sm" py="xl">
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Stack gap="xl">
                    <Group justify="space-between">
                        <Group>
                            <Avatar size={80} radius={80} color="olive">
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Title order={2}>{user.name}</Title>
                                <Badge color="olive" variant="light">Professional Artisan</Badge>
                            </Box>
                        </Group>
                        <Button variant="light" color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </Group>

                    <Divider label="Account Information" labelPosition="center" />

                    <Stack gap="md">
                        <Group>
                            <IconUser size={20} color="gray" />
                            <Box>
                                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Full Name</Text>
                                <Text fw={500}>{user.name}</Text>
                            </Box>
                        </Group>

                        <Group>
                            <IconMail size={20} color="gray" />
                            <Box>
                                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Email Address</Text>
                                <Text fw={500}>{user.email}</Text>
                            </Box>
                        </Group>

                        <Group>
                            <IconCalendar size={20} color="gray" />
                            <Box>
                                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>Joined On</Text>
                                <Text fw={500}>{new Date(user.createdAt).toLocaleDateString()}</Text>
                            </Box>
                        </Group>
                    </Stack>

                    <Box mt="xl" p="md" bg="blue.0" style={{ borderRadius: '8px' }}>
                        <Text size="sm" ta="center" color="blue.9" fw={500}>
                            Your account is secured with Enterprise Encryption.
                        </Text>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Profile;
