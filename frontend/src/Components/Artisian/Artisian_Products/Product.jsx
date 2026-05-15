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
    Textarea,
    Select,
    SimpleGrid,
    ActionIcon,
    Box
} from '@mantine/core';
import { 
    IconPalette, 
    IconTag, 
    IconCash, 
    IconPlus, 
    IconInfoCircle, 
    IconFileDescription,
    IconTrash,
    IconHammer
} from '@tabler/icons-react';

const Product = () => {
    const [productList, setProductList] = useState([]);
    const [materials, setMaterials] = useState([]);

    const initialFormState = {
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        materialsUsed: []
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/material/all', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data.success) {
                    setMaterials(res.data.materials);
                }
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };
        fetchMaterials();
    }, []);

    const addMaterialRow = () => {
        setFormData({
            ...formData,
            materialsUsed: [...formData.materialsUsed, { materialId: '', name: '', quantity: 1 }]
        });
    };

    const removeMaterialRow = (index) => {
        const updated = [...formData.materialsUsed];
        updated.splice(index, 1);
        setFormData({ ...formData, materialsUsed: updated });
    };

    const handleMaterialChange = (index, materialId) => {
        const selected = materials.find(m => m._id === materialId);
        const updated = [...formData.materialsUsed];
        updated[index] = { 
            ...updated[index], 
            materialId, 
            name: selected?.name || '',
            unit: selected?.unit || ''
        };
        setFormData({ ...formData, materialsUsed: updated });
    };

    const handleMaterialQtyChange = (index, qty) => {
        const updated = [...formData.materialsUsed];
        updated[index].quantity = qty;
        setFormData({ ...formData, materialsUsed: updated });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            ...formData,
        };

        setProductList([...productList, newProduct]);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/products/addproduct',
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Product added successfully:', response.data);
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <Container size="sm" py="xl">
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Stack gap="lg">
                    <Group justify="center" gap="sm">
                        <IconPalette size={40} color="#556B2F" />
                        <Title order={1} style={{ letterSpacing: '-1.5px', fontWeight: 900 }}>Add New Product</Title>
                    </Group>

                    <Text color="dimmed" ta="center" size="md">
                        List your artisan products in the marketplace.
                    </Text>

                    <Divider label="Product Details" labelPosition="center" />

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Product Name"
                                placeholder="e.g., Handcrafted Ceramic Vase"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                size="md"
                                leftSection={<IconPalette size={18} />}
                            />

                            <Textarea
                                label="Description"
                                placeholder="Describe your product's features and craftsmanship..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                minRows={3}
                                size="md"
                                leftSection={<IconFileDescription size={18} />}
                            />

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                <NumberInput
                                    label="Price"
                                    placeholder="Amount in ₹"
                                    value={formData.price}
                                    onChange={(val) => setFormData({ ...formData, price: val })}
                                    required
                                    min={0}
                                    size="md"
                                    leftSection={<IconCash size={18} />}
                                />
                                <Select
                                    label="Category"
                                    placeholder="Select category"
                                    data={['Ceramics', 'Woodwork', 'Textiles', 'Jewelry', 'Glassware', 'Leather', 'Other']}
                                    value={formData.category}
                                    onChange={(val) => setFormData({ ...formData, category: val })}
                                    required
                                    size="md"
                                    leftSection={<IconTag size={18} />}
                                />
                                <Select
                                    label="Quantity"
                                    data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']}
                                    value={formData.quantity}
                                    onChange={(val) => setFormData({ ...formData, quantity: val })}
                                    required
                                    size="md"
                                    leftSection={<IconTag size={18} />}
                                />
                            </SimpleGrid>

                            <Divider label="Materials Used (Per Unit)" labelPosition="center" mt="md" />
                            
                            {formData.materialsUsed.map((row, index) => (
                                <Group key={index} grow align="flex-end">
                                    <Select
                                        label="Material"
                                        placeholder="Choose material"
                                        data={materials.map(m => ({ value: m._id, label: `${m.name} (${m.quantity} ${m.unit} avail.)` }))}
                                        value={row.materialId}
                                        onChange={(val) => handleMaterialChange(index, val)}
                                        required
                                        searchable
                                    />
                                    <NumberInput
                                        label="Qty per unit"
                                        value={row.quantity}
                                        onChange={(val) => handleMaterialQtyChange(index, val)}
                                        min={0.01}
                                        decimalScale={2}
                                        required
                                    />
                                    <ActionIcon 
                                        color="red" 
                                        variant="light" 
                                        size="lg" 
                                        onClick={() => removeMaterialRow(index)}
                                        style={{ marginBottom: '5px' }}
                                    >
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            ))}

                            <Button 
                                variant="outline" 
                                size="xs" 
                                leftSection={<IconHammer size={14} />} 
                                onClick={addMaterialRow}
                                fullWidth
                                mt="xs"
                            >
                                Add Raw Material
                            </Button>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                radius="md"
                                mt="xl"
                                leftSection={<IconPlus size={20} />}
                                color="olive"
                                variant="filled"
                                style={{ boxShadow: '0 4px 15px rgba(34, 139, 230, 0.3)' }}
                            >
                                Publish Product
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            {productList.length > 0 && (
                <Paper shadow="md" radius="lg" p="xl" mt="2rem" withBorder bg="var(--mantine-color-gray-0)">
                    <Group mb="lg">
                        <IconInfoCircle size={24} color="gray" />
                        <Title order={2} size="h3">Recently Published</Title>
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        {productList.map((product) => (
                            <Paper key={product.id} p="md" radius="md" withBorder shadow="sm" bg="white">
                                <Stack gap="xs">
                                    <Title order={4} color="olive">{product.name}</Title>
                                    <Text size="sm" lineClamp={2} color="dimmed">{product.description}</Text>
                                    <Group justify="space-between" mt="sm">
                                        <Text fw={700} color="green">₹{product.price}</Text>
                                        <Text size="xs" color="olive" bg="olive.0" px="xs" py={2} style={{ borderRadius: '4px' }}>
                                            {product.category}
                                        </Text>
                                    </Group>
                                    {product.materialsUsed && product.materialsUsed.length > 0 && (
                                        <Box mt="xs">
                                            <Text size="xs" fw={700} color="dimmed" mb={4}>Materials:</Text>
                                            <Group gap={4}>
                                                {product.materialsUsed.map((m, i) => (
                                                    <Text key={i} size="xs" bg="gray.1" px={6} py={2} style={{ borderRadius: '4px' }}>
                                                        {m.name} x{m.quantity}
                                                    </Text>
                                                ))}
                                            </Group>
                                        </Box>
                                    )}
                                </Stack>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </Paper>
            )}
        </Container>
    );
};

export default Product;