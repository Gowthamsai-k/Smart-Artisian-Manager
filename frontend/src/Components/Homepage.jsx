import { useState } from 'react';
import { 
    Box, 
    Container, 
    Title, 
    Text, 
    Grid, 
    Card, 
    Button, 
    Modal,
    Group
} from '@mantine/core';

const Homepage = () => {
    const [selectedId, setSelectedId] = useState(null);

    const data = [
        { id: 1, name: "Painting 1", description: "This is a beautiful landscape painting capturing the essence of nature." },
        { id: 2, name: 'Painting 2', description: 'This is a modern abstract piece utilizing vibrant colors and shapes.' }
    ];

    const selectedPainting = data.find(p => p.id === selectedId);

    const handleView = (id) => {
        console.log("Selected ID:", id);
        setSelectedId(id);
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
                padding: 'var(--mantine-spacing-xl)'
            }}
        >
            <Container size="lg" w="100%">
                <Title 
                    order={1} 
                    ta="center" 
                    mb="xl" 
                    c="white"
                    style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        fontFamily: 'Greycliff CF, var(--mantine-font-family)'
                    }}
                >
                    Featured Artwork
                </Title>

                <Grid justify="center">
                    {data.map((e) => (
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={e.id}>
                            <Card 
                                shadow="sm" 
                                padding="lg" 
                                radius="md" 
                                withBorder
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Title order={3} fw={600} mb="xs">
                                    {e.name}
                                </Title>
                                <Text size="sm" c="dimmed" mb="md" style={{ flex: 1 }}>
                                    {e.description}
                                </Text>

                                <Button 
                                    variant="light" 
                                    color="blue" 
                                    fullWidth 
                                    mt="md" 
                                    radius="md"
                                    onClick={() => handleView(e.id)}
                                >
                                    View Details
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                <Modal 
                    opened={!!selectedId} 
                    onClose={() => setSelectedId(null)} 
                    title={
                        <Title order={3}>Painting Details</Title>
                    }
                    centered
                    radius="md"
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                >
                    {selectedPainting && (
                        <Box>
                            <Title order={4} c="blue.7" mb="sm">
                                {selectedPainting.name}
                            </Title>
                            <Text size="md" mb="xl">
                                {selectedPainting.description}
                            </Text>
                            <Group justify="flex-end">
                                <Button variant="default" onClick={() => setSelectedId(null)}>Close</Button>
                            </Group>
                        </Box>
                    )}
                </Modal>
            </Container>
        </Box>
    );
};

export default Homepage;
