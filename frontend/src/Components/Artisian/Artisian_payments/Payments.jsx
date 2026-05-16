import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Table, 
    Container, 
    Title, 
    Paper, 
    Text, 
    Badge, 
    Group, 
    Stack,
    Box
} from '@mantine/core';
import { IconReceipt2, IconTrendingUp, IconCalendar } from '@tabler/icons-react';

const Payments = () => {
    const [sales, setSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const fetchSales = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/sales/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setSales(res.data.sales);
                const total = res.data.sales.reduce((acc, sale) => acc + sale.price, 0);
                setTotalRevenue(total);
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const rows = sales.map((sale) => (
        <Table.Tr key={sale._id}>
            <Table.Td>
                <Text size="sm" fw={500}>{sale.productName}</Text>
                <Text size="xs" color="dimmed">{sale.productId}</Text>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color="olive" radius="sm">
                    {sale.category}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{sale.quantity}</Text>
            </Table.Td>
            <Table.Td>
                <Text fw={700} color="green">₹{sale.price}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <IconCalendar size={14} color="gray" />
                    <Text size="xs" color="dimmed">
                        {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Paper shadow="sm" radius="md" p="xl" withBorder bg="var(--mantine-color-blue-0)">
                    <Group justify="space-between">
                        <Box>
                            <Title order={1} style={{ letterSpacing: '-1px' }}>Sales Analytics</Title>
                            <Text color="dimmed" size="sm">Review your transaction history and total earnings.</Text>
                        </Box>
                        <Paper p="md" radius="md" withBorder shadow="xs">
                            <Stack gap={0}>
                                <Text size="xs" fw={700} tt="uppercase" color="dimmed">Total Revenue</Text>
                                <Group gap="xs">
                                    <IconTrendingUp size={24} color="green" />
                                    <Text size="xl" fw={900} color="green">₹{totalRevenue.toLocaleString()}</Text>
                                </Group>
                            </Stack>
                        </Paper>
                    </Group>
                </Paper>

                <Paper shadow="md" radius="lg" p="xl" withBorder>
                    <Group mb="lg">
                        <IconReceipt2 size={24} color="var(--mantine-color-blue-filled)" />
                        <Title order={2} size="h3">Transaction Log</Title>
                    </Group>

                    {sales.length > 0 ? (
                        <Table striped highlightOnHover verticalSpacing="md">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Product Info</Table.Th>
                                    <Table.Th>Category</Table.Th>
                                    <Table.Th>Qty</Table.Th>
                                    <Table.Th>Total Amount</Table.Th>
                                    <Table.Th>Timestamp</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    ) : (
                        <Box py="xl" ta="center">
                            <Text color="dimmed">No transactions found. Start selling to see data here!</Text>
                        </Box>
                    )}
                </Paper>
            </Stack>
        </Container>
    );
};

export default Payments;