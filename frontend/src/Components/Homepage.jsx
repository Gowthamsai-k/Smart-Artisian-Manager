import {
    Box,
    Container,
    Title,
    Text,
    Grid,
    Button,
    Group,
    Badge,
    Image,
    Paper,
    ThemeIcon,
    SimpleGrid
} from '@mantine/core';
import { IconArrowRight, IconPlayerPlay, IconPoint, IconArrowUpRight, IconLayoutDashboard, IconAnalyze } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
            {/* Hero Section */}
            <Box style={{ flex: 1, display: 'flex', alignItems: 'center' }} py={80}>
                <Container size="xl" w="100%">
                    <Grid align="center" gutter={60}>
                        {/* Left Column - Text Content */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Badge
                                variant="light"
                                color="#556B2F"
                                size="lg"
                                radius="xl"
                                leftSection={<IconPoint size={16} style={{ marginTop: '2px' }} />}
                                mb="xl"
                                fw={700}
                                style={{ letterSpacing: '0.5px' }}
                            >
                                ENTERPRISE PRECISION
                            </Badge>

                            <Title
                                order={1}
                                fw={900}
                                style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                    lineHeight: 1.1,
                                    letterSpacing: '-1px',
                                    color: '#1a1b1e'
                                }}
                                mb="lg"
                            >
                                Master Your <br />
                                <span style={{ color: '#556B2F' }}>Production</span> Flow
                            </Title>

                            <Text size="lg" c="dimmed" mb={40} style={{ lineHeight: 1.6, maxWidth: '540px' }}>
                                The artisan management system designed for scale. Orchestrate complex workflows, monitor real-time efficiency, and streamline your entire global artisan network from a single, sophisticated dashboard.
                            </Text>

                            <Group justify="center">
                                <Button
                                    component={Link}
                                    to="/signup"
                                    size="lg"
                                    radius="sm"
                                    color="#556B2F"
                                    rightSection={<IconArrowRight size={18} />}
                                    fw={600}
                                    px="xl"
                                >
                                    Get Started
                                </Button>
                            </Group>
                        </Grid.Col>
                        {/* Right Column - Image */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Box style={{ position: 'relative' }}>
                                {/* Decorative background shape */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-5%',
                                    right: '-5%',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(85, 107, 47, 0.1)',
                                    borderRadius: '24px',
                                    zIndex: 0,
                                }}></div>

                                <Image
                                    src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1200"
                                    alt="Artisan Workshop"
                                    radius="xl"
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                                    }}
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>



            {/* Footer Placeholder */}
            <Box py="xl" style={{ borderTop: '1px solid #e9ecef' }}>
                <Container size="xl">
                    <Group justify="space-between">
                        <Group gap="xs">
                            <IconAnalyze color="#556B2F" size={24} stroke={2} />
                            <Text fw={900} size="lg" c="#556B2F" style={{ letterSpacing: '-0.5px' }}>
                                ArtisanFlow
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            © 2026 ArtisanFlow. All rights reserved.
                        </Text>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
};

export default Homepage;
