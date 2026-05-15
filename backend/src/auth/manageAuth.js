import jwt from 'jsonwebtoken'
import Client from '../models/Client.js'
import bcrypt from 'bcryptjs'

// Register
export const Signup = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const ExistingUser = await Client.findOne({
            email: email
        })

        if (ExistingUser) {
            return res.status(400).send({
                message: "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newClient = new Client({
            name: name,
            email: email,
            password: hashedPassword
        })

        // Save user in MongoDB
        await newClient.save()

        // Generate JWT
        const token = jwt.sign(
            {
                id: newClient._id,
                email: newClient.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(201).send({
            message: "user created successfully",
            token,
            user: newClient
        })

    }
    catch (e) {

        console.log(e)

        return res.status(500).send({
            message: "Internal Server Error"
        })
    }
}


// Login
export const Login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await Client.findOne({
            email: email
        })

        if (!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).send({
                message: 'password is incorrect'
            })
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        return res.status(200).json({
            message: "Login successful",
            token,
            user,
        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
}