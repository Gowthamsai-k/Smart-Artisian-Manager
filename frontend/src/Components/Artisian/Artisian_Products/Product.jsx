import { useState } from "react";

const Product = () => {
    const [products, setProducts] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: "",
        description: "",
        price: "",
        category: "",
        rating: "",

        // conditional fields
        oilBrand: "",
        canvasSize: "",
        pencilGrade: "",
        paperType: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add Product
    const addProduct = async (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            ...formData,
        };

        setProducts([...products, newProduct]);

        setFormData(initialFormState);
        try {

            const res = await axios.post('http://localhost:3000/api/products/addproduct', formData, { withCredentials: true },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            console.log('This is res:', res)
        }
        catch (e) {
            console.log(e)
        }
    }

    // Delete Product
    const deleteProduct = (id) => {
        setProducts(products.filter((e) => e.id !== id));
    };

    // Fill Form For Update
    const updateProduct = (product) => {
        setFormData(product);
        setEditingId(product.id);
    };

    // Save Updated Product
    const saveUpdatedProduct = (e) => {
        e.preventDefault();

        setProducts(
            products.map((e) =>
                e.id === editingId
                    ? {
                        ...e,
                        ...formData,
                    }
                    : e
            )
        );

        setEditingId(null);

        setFormData(initialFormState);
    };

    return (
        <>
            <h1>Painting Product Form</h1>

            {/* FORM */}

            <form
                onSubmit={
                    editingId
                        ? saveUpdatedProduct
                        : addProduct
                }
            >
                {/* Common Fields */}

                <input
                    type="text"
                    name="name"
                    placeholder="Painting Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    type="text"
                    name="rating"
                    placeholder="Rating"
                    value={formData.rating}
                    onChange={handleChange}
                />

                <br />
                <br />

                {/* Category */}

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Category
                    </option>

                    <option value="oil-painting">
                        Oil Painting
                    </option>

                    <option value="sketch">
                        Sketch
                    </option>

                    <option value="watercolor">
                        Watercolor
                    </option>
                </select>

                <br />
                <br />

                {/* Conditional Fields */}

                {formData.category === "oil-painting" && (
                    <>
                        <input
                            type="text"
                            name="oilBrand"
                            placeholder="Oil Brand"
                            value={formData.oilBrand}
                            onChange={handleChange}
                        />

                        <br />
                        <br />

                        <input
                            type="text"
                            name="canvasSize"
                            placeholder="Canvas Size"
                            value={formData.canvasSize}
                            onChange={handleChange}
                        />

                        <br />
                        <br />
                    </>
                )}

                {formData.category === "sketch" && (
                    <>
                        <input
                            type="text"
                            name="pencilGrade"
                            placeholder="Pencil Grade"
                            value={formData.pencilGrade}
                            onChange={handleChange}
                        />

                        <br />
                        <br />
                    </>
                )}

                {formData.category === "watercolor" && (
                    <>
                        <input
                            type="text"
                            name="paperType"
                            placeholder="Paper Type"
                            value={formData.paperType}
                            onChange={handleChange}
                        />

                        <br />
                        <br />
                    </>
                )}

                {/* Submit Button */}

                <button type="submit">
                    {editingId
                        ? "Save Update"
                        : "Add Product"}
                </button>
            </form>

            <hr />

            {/* PRODUCT LIST */}

            {products.map((e) => (
                <div
                    key={e.id}
                    style={{
                        border: "1px solid gray",
                        padding: "10px",
                        margin: "10px",
                    }}
                >
                    <h2>{e.name}</h2>

                    <p>Description: {e.description}</p>

                    <p>Price: {e.price}</p>

                    <p>Category: {e.category}</p>

                    <p>Rating: {e.rating}</p>

                    {/* Conditional Display */}

                    {e.oilBrand && (
                        <p>Oil Brand: {e.oilBrand}</p>
                    )}

                    {e.canvasSize && (
                        <p>Canvas Size: {e.canvasSize}</p>
                    )}

                    {e.pencilGrade && (
                        <p>Pencil Grade: {e.pencilGrade}</p>
                    )}

                    {e.paperType && (
                        <p>Paper Type: {e.paperType}</p>
                    )}

                    {/* Buttons */}

                    <button
                        onClick={() => updateProduct(e)}
                    >
                        Update
                    </button>

                    <button
                        onClick={() => deleteProduct(e.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
};

export default Product;