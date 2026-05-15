import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}
export default protect