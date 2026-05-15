import { useState } from 'react';
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
    SimpleGrid
} from '@mantine/core';
import { IconPalette, IconTag, IconCash, IconPlus, IconInfoCircle, IconFileDescription } from '@tabler/icons-react';

const Product = () => {
    const [productList, setProductList] = useState([]);

    const initialFormState = {
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
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
                        <IconPalette size={40} color="var(--mantine-color-blue-filled)" />
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

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                radius="md"
                                mt="xl"
                                leftSection={<IconPlus size={20} />}
                                color="blue"
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
                                    <Title order={4} color="blue">{product.name}</Title>
                                    <Text size="sm" lineClamp={2} color="dimmed">{product.description}</Text>
                                    <Group justify="space-between" mt="sm">
                                        <Text fw={700} color="green">₹{product.price}</Text>
                                        <Text size="xs" color="blue" bg="blue.0" px="xs" py={2} style={{ borderRadius: '4px' }}>
                                            {product.category}
                                        </Text>
                                    </Group>
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