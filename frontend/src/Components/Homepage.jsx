import { useState } from 'react'

const Homepage = () => {

    const [selectedId, setSelectedId] = useState(null)

    const data = [
        { id: 1, name: "Painting1", description: "this is a painting" },
        { id: 2, name: 'painting2', description: 'this is painting2' }
    ]

    const handleView = (id) => {
        console.log("Selected ID:", id)
        setSelectedId(id)
    }

    return (
        <>
            <h1>This is homepage</h1>

            {selectedId && (
                <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                    <h2>This is painting with id: {selectedId}</h2>
                    <button onClick={() => setSelectedId(null)}>Close</button>
                </div>
            )}

            {data.map((e) => (
                <div key={e.id}>
                    <h2>{e.name}</h2>
                    <p>{e.description}</p>

                    <button onClick={() => handleView(e.id)}>View</button>
                </div>
            ))}
        </>
    )
}

export default Homepage
