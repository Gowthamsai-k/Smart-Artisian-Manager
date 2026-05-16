import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Title,
    Select,
    Button,
    Stack,
    Group,
    Text,
    Divider,
    NumberInput,
    Box,
    rem
} from '@mantine/core';
import { IconShoppingCart, IconTag, IconCash, IconPlus, IconCheck } from '@tabler/icons-react';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const initialFormState = {
        productId: '',
        productName: '',
        price: 0,
        category: '',
        quantity: 1,
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch existing products for the dropdown
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/sales/products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setProducts(res.data.products.filter(p => p.quantity > 0));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductChange = (id) => {
        const selectedProduct = products.find(p => p._id === id);
        if (selectedProduct) {
            setFormData({
                ...formData,
                productId: selectedProduct._id,
                productName: selectedProduct.name,
                price: selectedProduct.price,
                category: selectedProduct.category,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId) return;

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3000/api/sales/',
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                setSalesList([response.data.sale, ...salesList]);
                setFormData(initialFormState);
                fetchProducts();
                setError(""); // Clear error on success
            }
        } catch (error) {
            console.error('Error recording sale:', error);
            setError(error.response?.data?.message || 'Error recording sale');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm" py="xl">
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Stack gap="lg">
                    <Group justify="center" gap="sm">
                        <IconShoppingCart size={40} color="var(--mantine-color-green-filled)" />
                        <Title order={1} style={{ letterSpacing: '-1.5px', fontWeight: 900 }}>Record Sale</Title>
                    </Group>

                    <Text color="dimmed" ta="center" size="md">
                        Log multiple quantities of a product in a single transaction.
                    </Text>

                    <Divider label="Sale Details" labelPosition="center" />

                    {error && (
                        <Text color="red" size="sm" ta="center" mt="md" fw={500}>
                            ⚠️ {error}
                        </Text>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <Select
                                label="Select Product"
                                placeholder="Choose a product"
                                data={products.map(p => ({ value: p._id, label: `${p.name} (Stock: ${p.quantity})` }))}
                                value={formData.productId}
                                onChange={handleProductChange}
                                required
                                size="md"
                                leftSection={<IconTag size={18} />}
                                searchable
                                clearable
                            />

                            {formData.productId && (
                                <Box p="md" bg="var(--mantine-color-gray-0)" style={{ borderRadius: rem(8) }}>
                                    <Stack gap="md">
                                        <Group justify="space-between">
                                            <Text size="sm" fw={500}>Unit Price:</Text>
                                            <Text size="sm" fw={700} color="green">₹{formData.price}</Text>
                                        </Group>

                                        <NumberInput
                                            label="Purchase Quantity"
                                            placeholder="Number of items"
                                            value={formData.quantity}
                                            onChange={(val) => setFormData({ ...formData, quantity: val })}
                                            min={1}
                                            max={products.find(p => p._id === formData.productId)?.quantity || 1}
                                            required
                                            size="sm"
                                        />

                                        <Divider />

                                        <Group justify="space-between">
                                            <Text fw={700}>Total Amount:</Text>
                                            <Text fw={900} size="lg" color="green">₹{formData.price * formData.quantity}</Text>
                                        </Group>
                                    </Stack>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                radius="md"
                                mt="md"
                                leftSection={<IconCheck size={20} />}
                                color="green"
                                loading={loading}
                                disabled={!formData.productId}
                            >
                                Confirm Sale
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            {salesList.length > 0 && (
                <Paper shadow="md" radius="lg" p="xl" mt="2rem" withBorder>
                    <Title order={3} mb="md">Recent Sales (This Session)</Title>
                    <Stack gap="xs">
                        {salesList.map((sale, index) => (
                            <Group key={index} justify="space-between" p="sm" style={{ borderBottom: '1px solid #eee' }}>
                                <Box>
                                    <Text fw={600}>{sale.productName}</Text>
                                    <Text size="xs" color="dimmed">
                                        Qty: {sale.quantity} • {new Date(sale.date).toLocaleString()}
                                    </Text>
                                </Box>
                                <Text fw={700} color="green">₹{sale.price}</Text>
                            </Group>
                        ))}
                    </Stack>
                </Paper>
            )}
        </Container>
    );
};

export default Sales;
