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
    Divider,
    ActionIcon, 
    SimpleGrid, 
    Box
} from '@mantine/core';
import { IconPackage, IconScale, IconCash, IconPlus, IconTrash, IconPencil } from '@tabler/icons-react';

const Materials = () => {
    const [materialList, setMaterialList] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: "",
        quantity: "",
        cost: "",
        unit: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/material/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                setMaterialList(response.data.materials);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = (mat) => {
        setEditingId(mat._id);
        setFormData({
            name: mat.name,
            quantity: mat.quantity,
            cost: mat.cost,
            unit: mat.unit
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this material?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/material/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMaterialList(materialList.filter(m => m._id !== id));
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:3000/api/material/${editingId}`, 
                    formData, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setEditingId(null);
            } else {
                await axios.post(
                    'http://localhost:3000/api/material', 
                    formData, 
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
            }
            
            setFormData(initialFormState);
            fetchMaterials();
        } catch (error) {
            console.error('Error saving material:', error);
        }
    };

    return (
        <Container size="md" py="xl">
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Stack gap="md">
                    <Group justify="center">
                        <IconPackage size={40} color="#556B2F" />
                        <Title order={1} style={{ letterSpacing: '-1.5px', fontWeight: 900 }}>
                            {editingId ? "Edit Material" : "Inventory Management"}
                        </Title>
                    </Group>
                    
                    <Text color="dimmed" ta="center" size="md">
                        {editingId ? "Update your supply details." : "Add new materials to your artisan supplies list."}
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
                                size="md"
                                leftSection={<IconPackage size={18} />}
                            />

                            <Group grow>
                                <NumberInput
                                    label="Quantity"
                                    placeholder="Amount"
                                    value={formData.quantity}
                                    onChange={(val) => setFormData({ ...formData, quantity: val })}
                                    required
                                    min={0}
                                    size="md"
                                    leftSection={<IconScale size={18} />}
                                />
                                <TextInput
                                    label="Unit"
                                    placeholder="e.g., kg, pieces"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    size="md"
                                />
                            </Group>

                            <NumberInput
                                label="Total Cost"
                                placeholder="Total Cost (₹)"
                                value={formData.cost}
                                onChange={(val) => setFormData({ ...formData, cost: val })}
                                required
                                min={0}
                                size="md"
                                leftSection={<IconCash size={18} />}
                            />

                            <Group grow mt="md">
                                {editingId && (
                                    <Button variant="light" color="gray" onClick={() => { setEditingId(null); setFormData(initialFormState); }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    radius="md"
                                    leftSection={editingId ? <IconPencil size={20} /> : <IconPlus size={20} />}
                                    color="olive"
                                    variant="filled"
                                    style={{ boxShadow: '0 4px 15px rgba(85, 107, 47, 0.3)' }}
                                >
                                    {editingId ? "Update Stock" : "Add to Inventory"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            <Divider my="3rem" label="Supplies & Inventory" labelPosition="center" />

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {materialList.map((item) => (
                    <Paper key={item._id} p="md" radius="md" withBorder shadow="sm" bg="white">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Title order={4} color="olive">{item.name}</Title>
                                <Group gap={4}>
                                    <ActionIcon variant="light" color="blue" onClick={() => handleEdit(item)}>
                                        <IconPencil size={14} />
                                    </ActionIcon>
                                    <ActionIcon variant="light" color="red" onClick={() => handleDelete(item._id)}>
                                        <IconTrash size={14} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                            
                            <Group justify="space-between" mt="xs">
                                <Box>
                                    <Text size="xs" color="dimmed">Stock Level</Text>
                                    <Text fw={700}>{item.quantity} {item.unit}</Text>
                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <Text size="xs" color="dimmed">Value</Text>
                                    <Text fw={700} color="green">₹{item.cost}</Text>
                                </Box>
                            </Group>
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default Materials;