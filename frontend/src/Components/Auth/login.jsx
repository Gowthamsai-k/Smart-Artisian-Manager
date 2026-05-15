import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            const response = await axios.post('http://localhost:3000/api/auth/login', formData, { withCredentials: true })
            console.log(response.data.token)
            localStorage.setItem("token", response.data.token)
            navigate('/Home')
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h1>
                This is Login Page
            </h1>
            <form onSubmit={handleSubmit}>
                <input type='email' name='email' placeholder='Email' onChange={handleChange} value={formData.email} />
                <input type='password' name='password' onChange={handleChange} value={formData.password} />
                <button type='submit'>Login</button>
            </form>
            <p>
                Dont have an account ?
                <Link to='/signup'>Register Now</Link>
            </p>
        </>
    )
}
export default Login;