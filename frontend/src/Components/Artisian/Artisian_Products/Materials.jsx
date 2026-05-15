import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, 
    Paper, 
    Title, 
    TextInput, 
    NumberInput, 
    Button, 
    Stack, 
    Group, 
    Text, 
    Divider 
} from '@mantine/core';
import { IconPackage, IconScale, IconCash, IconPlus } from '@tabler/icons-react';

const Materials = () => {
    // materialList will store the array of materials added
    const [materialList, setMaterialList] = useState([]);

    const initialFormState = {
        name: "",
        quantity: "",
        cost: "",
        unit: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newMat = {
            id: Date.now(),
            ...formData,
        };

        // Update local state
        setMaterialList([newMat, ...materialList]);

        try {
            // Correct axios post call with headers for authorization
            const response = await axios.post(
                'http://localhost:3000/api/material', 
                formData, 
                { 
                    withCredentials: true,
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    } 
                }
            );
            
            console.log('Material added successfully:', response.data);

            // Reset form
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error adding material:', error);
        }
    };

    return (
        <Container size="sm" py="xl">
            <Paper shadow="xl" radius="md" p="xl" withBorder>
                <Stack gap="md">
                    <Group justify="center">
                        <IconPackage size={32} color="#556B2F" />
                        <Title order={1} style={{ letterSpacing: '-1px' }}>Materials Inventory</Title>
                    </Group>
                    
                    <Text color="dimmed" ta="center" size="sm">
                        Add new materials to your artisan supplies list.
                    </Text>

                    <Divider my="sm" />

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Material Name"
                                placeholder="e.g., Canvas, Oil Paint"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                leftSection={<IconPackage size={16} />}
                            />

                            <Group grow>
                                <NumberInput
                                    label="Quantity"
                                    placeholder="Amount"
                                    value={formData.quantity}
                                    onChange={(val) => setFormData({ ...formData, quantity: val })}
                                    required
                                    min={0}
                                    leftSection={<IconScale size={16} />}
                                />
                                <TextInput
                                    label="Unit"
                                    placeholder="e.g., kg, pieces"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                />
                            </Group>

                            <NumberInput
                                label="Cost"
                                placeholder="Total Cost (₹)"
                                value={formData.cost}
                                onChange={(val) => setFormData({ ...formData, cost: val })}
                                required
                                min={0}
                                leftSection={<IconCash size={16} />}
                            />

                            <Button 
                                type="submit" 
                                fullWidth 
                                size="md" 
                                radius="md"
                                mt="md"
                                leftSection={<IconPlus size={18} />}
                                color="olive"
                            >
                                Add Material
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            {/* Optional: Display added materials below the form */}
            {materialList.length > 0 && (
                <Paper shadow="xs" radius="md" p="md" mt="xl" withBorder>
                    <Title order={3} mb="md">Recently Added</Title>
                    <Stack gap="xs">
                        {materialList.map((item) => (
                            <Group key={item.id} justify="space-between" p="xs" style={{ borderBottom: '1px solid #eee' }}>
                                <Text fw={500}>{item.name}</Text>
                                <Text size="sm">{item.quantity} {item.unit} - ₹{item.cost}</Text>
                            </Group>
                        ))}
                    </Stack>
                </Paper>
            )}
        </Container>
    );
};

export default Materials;