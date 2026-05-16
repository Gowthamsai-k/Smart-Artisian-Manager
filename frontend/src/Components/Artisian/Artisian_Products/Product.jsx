import { useState, useEffect, useRef } from 'react';
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
    Box,
    FileButton,
    Image,
    Loader,
    Badge,
    Tooltip,
    Alert
} from '@mantine/core';
import {
    IconPalette,
    IconTag,
    IconCash,
    IconPlus,
    IconInfoCircle,
    IconFileDescription,
    IconTrash,
    IconHammer,
    IconSparkles,
    IconCamera,
    IconRefresh
} from '@tabler/icons-react';

const Product = () => {
    const [productList, setProductList] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: "",
        description: "",
        price: null,
        category: "",
        quantity: null,
        materialsUsed: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiReasoning, setAiReasoning] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const resetRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/products/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setProductList(res.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

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
        fetchProducts();
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
        updated[index].quantity = qty ?? 0;
        setFormData({ ...formData, materialsUsed: updated });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            quantity: product.quantity,
            materialsUsed: product.materialsUsed || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProductList(productList.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result;
            setSelectedImage(imageData);
            // Automatically trigger analysis with the new image
            handleAIPredict(imageData);
            // Reset the file input so the same image can be uploaded again if needed
            resetRef.current?.();
        };
        reader.readAsDataURL(file);
    };

    const handleAIPredict = async (passedImage = null) => {
        const imageToUse = passedImage || selectedImage;
        if (!formData.description && !imageToUse) {
            setError("Please provide a description or an image for AI analysis.");
            return;
        }

        setAiLoading(true);
        setError("");
        setAiReasoning("");

        try {
            const res = await axios.post('http://localhost:3000/api/ai/predict-price', {
                description: formData.description,
                materialsUsed: formData.materialsUsed,
                category: formData.category,
                image: imageToUse,
                inventory: materials.map(m => ({ name: m.name, cost: m.cost, qty: m.quantity, unit: m.unit }))
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name || prev.name,
                    category: res.data.category || prev.category,
                    description: res.data.description || prev.description,
                    price: res.data.suggestedPrice
                }));
                setAiReasoning(res.data.reasoning);
            }
        } catch (error) {
            console.error('AI Prediction Error:', error);
            setError(error.response?.data?.message || "AI analysis failed. Please try a smaller image or enter details manually.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.description.trim() || !formData.category || formData.price === '' || formData.price === null || formData.quantity === '' || formData.quantity === null || Number(formData.quantity) <= 0) {
            setError('Please fill in all required product fields before saving.');
            return;
        }

        const invalidMaterial = formData.materialsUsed.some((item) => !item.materialId || item.quantity === '' || item.quantity <= 0);
        if (invalidMaterial) {
            setError('Please choose a material and enter a quantity for each material row.');
            return;
        }

        const insufficientMaterials = formData.materialsUsed.filter((item) => {
            const material = materials.find((m) => m._id === item.materialId);
            return material && Number(item.quantity) * Number(formData.quantity) > Number(material.quantity);
        });

        if (insufficientMaterials.length > 0) {
            const names = insufficientMaterials
                .map((item) => {
                    const material = materials.find((m) => m._id === item.materialId);
                    return material?.name || 'selected material';
                })
                .join(', ');
            setError(`Insufficient materials available for: ${names}. Please reduce the product quantity or increase stock.`);
            return;
        }

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                materialsUsed: formData.materialsUsed.map((item) => ({
                    materialId: item.materialId,
                    name: item.name,
                    quantity: Number(item.quantity)
                }))
            };

            if (editingId) {
                await axios.put(
                    `http://localhost:3000/api/products/${editingId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setEditingId(null);
            } else {
                await axios.post(
                    'http://localhost:3000/api/products/addproduct',
                    payload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
            }

            setError('');
            setFormData(initialFormState);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            if (error.response?.status === 400) {
                setError(error.response?.data?.message || 'Insufficient materials available to add this product.');
            } else {
                setError('Unable to save the product. Please try again.');
            }
        }
    };

    return (
        <Container size="md" py="xl">
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Stack gap="lg">
                    <Group justify="center" gap="sm">
                        <IconPalette size={40} color="#556B2F" />
                        <Title order={1} style={{ letterSpacing: '-1.5px', fontWeight: 900 }}>
                            {editingId ? "Edit Product" : "Add New Product"}
                        </Title>
                    </Group>

                    <Text color="dimmed" ta="center" size="md">
                        {editingId ? "Modify your existing artisan product details." : "List your artisan products in the marketplace."}
                    </Text>

                    <Divider label="Product Details" labelPosition="center" />

                    {error && (
                        <Text color="red" ta="center" size="sm" mt="md">
                            {error}
                        </Text>
                    )}

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
                                onBlur={() => {
                                    if (formData.description.length > 20 && !formData.price) {
                                        // Optional: Auto trigger or show a tip
                                    }
                                }}
                                required
                                minRows={3}
                                size="md"
                                leftSection={<IconFileDescription size={18} />}
                                description="Tip: Mention specific craft techniques to increase predicted value!"
                            />

                            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                <Box>
                                    <NumberInput
                                        label="Selling Price"
                                        placeholder="Amount in ₹"
                                        value={formData.price}
                                        onChange={(val) => setFormData({ ...formData, price: val })}
                                        required
                                        min={0}
                                        size="md"
                                        leftSection={<IconCash size={18} />}
                                    />
                                    <Stack gap={4} mt={4}>
                                        <Button
                                            variant="light"
                                            color="grape"
                                            size="compact-sm"
                                            leftSection={<IconSparkles size={14} />}
                                            onClick={() => handleAIPredict()}
                                            loading={aiLoading}
                                            fullWidth
                                        >
                                            AI: Calculate 40%+ Profit
                                        </Button>
                                        <FileButton resetRef={resetRef} onChange={handleImageUpload} accept="image/png,image/jpeg">
                                            {(props) => (
                                                <Button
                                                    {...props}
                                                    variant="subtle"
                                                    color="blue"
                                                    size="compact-xs"
                                                    leftSection={<IconCamera size={12} />}
                                                    fullWidth
                                                >
                                                    Analysis by Photo
                                                </Button>
                                            )}
                                        </FileButton>
                                    </Stack>
                                </Box>
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
                                <NumberInput
                                    label="Stock Quantity"
                                    value={formData.quantity}
                                    onChange={(val) => setFormData({ ...formData, quantity: val })}
                                    required
                                    min={1}
                                    size="md"
                                    leftSection={<IconInfoCircle size={18} />}
                                />
                            </SimpleGrid>

                            {selectedImage && (
                                <Box mt="sm" pos="relative" w={150}>
                                    <Image src={selectedImage} radius="md" h={100} w={150} />
                                    <ActionIcon
                                        pos="absolute"
                                        top={5}
                                        right={5}
                                        color="red"
                                        size="sm"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <IconTrash size={12} />
                                    </ActionIcon>
                                    <Badge size="xs" color="blue" mt={4}>Image for analysis</Badge>
                                </Box>
                            )}

                            {aiReasoning && (
                                <Alert color="grape" variant="light" icon={<IconSparkles size={16} />} title="AI Reasoning">
                                    <Text size="xs">{aiReasoning}</Text>
                                </Alert>
                            )}

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
                                type="button"
                                variant="outline"
                                size="xs"
                                leftSection={<IconHammer size={14} />}
                                onClick={addMaterialRow}
                                fullWidth
                                mt="xs"
                                color="olive"
                            >
                                Add Raw Material
                            </Button>

                            <Group grow mt="xl">
                                {editingId && (
                                    <Button type="button" variant="light" color="gray" onClick={() => { setEditingId(null); setFormData(initialFormState); setError(''); }}>
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="md"
                                    leftSection={editingId ? <IconFileDescription size={20} /> : <IconPlus size={20} />}
                                    color="olive"
                                    variant="filled"
                                    style={{ boxShadow: '0 4px 15px rgba(85, 107, 47, 0.3)' }}
                                >
                                    {editingId ? "Update Product" : "Publish Product"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            <Divider my="3rem" label="Product Catalog" labelPosition="center" />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {productList.map((product) => (
                    <Paper key={product._id} p="md" radius="md" withBorder shadow="sm" bg="white">
                        <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                                <Box>
                                    <Title order={4} color="olive">{product.name}</Title>
                                    <Text size="xs" color="dimmed">{product.category}</Text>
                                </Box>
                                <Group gap={4}>
                                    <ActionIcon variant="light" color="blue" onClick={() => handleEdit(product)}>
                                        <IconFileDescription size={16} />
                                    </ActionIcon>
                                    <ActionIcon variant="light" color="red" onClick={() => handleDelete(product._id)}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>

                            <Text size="sm" lineClamp={2} color="dimmed" style={{ minHeight: '40px' }}>{product.description}</Text>

                            <Group justify="space-between" mt="sm">
                                <Text fw={700} color="#556B2F" size="lg">₹{product.price}</Text>
                                <Text size="xs" fw={700} bg="gray.0" px="xs" py={2} style={{ borderRadius: '4px' }}>
                                    Stock: {product.quantity}
                                </Text>
                            </Group>

                            {product.materialsUsed && product.materialsUsed.length > 0 && (
                                <Box mt="xs">
                                    <Group gap={4}>
                                        {product.materialsUsed.slice(0, 3).map((m, i) => (
                                            <Text key={i} size="xs" bg="olive.0" color="olive" px={6} py={2} style={{ borderRadius: '4px' }}>
                                                {m.name}
                                            </Text>
                                        ))}
                                        {product.materialsUsed.length > 3 && <Text size="xs" color="dimmed">+{product.materialsUsed.length - 3} more</Text>}
                                    </Group>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default Product;