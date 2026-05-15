import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', formData, { withCredentials: true })

            console.log(response.data.token)
            localStorage.setItem("token", response.data.token)
            navigate('/Home')
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <label>Enter Name</label>
                <input type='text' name='name' value={formData.name} onChange={handleChange} />
                <br />
                <label>Enter Email</label>
                <input type='email' name='email' value={formData.email} onChange={handleChange} />
                <br />
                <label>Enter Password</label>
                <input type='password' name='password' value={formData.password} onChange={handleChange} />
                <br />
                <button type='submit'>Signup</button>

            </form >
            <p>
                Already have an account?
                <Link to="/login"> Login</Link>
            </p>


        </>

    )
}
export default Signup;