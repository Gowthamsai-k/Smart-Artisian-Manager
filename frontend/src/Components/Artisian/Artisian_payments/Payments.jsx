import { Table } from '@mantine/core';

const elements = [
    { Product_id: 6, Product: 12.011, Category: 'C', Price: 'Carbon' },
    { Product_id: 3, Product: 12.011, Category: 'C', Price: 'Carbon' },
    { Product_id: 4, Product: 12.011, Category: 'C', Price: 'Carbon' },
    { Product_id: 5, Product: 12.011, Category: 'C', Price: 'Carbon' },
    { Product_id: 1, Product: 12.011, Category: 'C', Price: 'Carbon' },
    { Product_id: 7, Product: 12.011, Category: 'C', Price: 'Carbon' },

];
const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
        <Table.Td>{element.Product_id}</Table.Td>
        <Table.Td>{element.Product}</Table.Td>
        <Table.Td>{element.Category}</Table.Td>
        <Table.Td>{element.Price}</Table.Td>
    </Table.Tr>
));


const Payments = () => {
    return (
        <>
            <h1>
                This is payments page
            </h1>
            <Table striped highlightOnHover withTableBorder>

                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Product id</Table.Th>
                        <Table.Th>Product name</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Price</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>

    )
}
export default Payments