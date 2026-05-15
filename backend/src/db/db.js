import mongoose from 'mongoose'

const connectDB = async () => {
    const mongo_url = process.env.mongo_url
    try {
        await mongoose.connect(mongo_url)
        console.log('MongoDb connected successfully')

    }
    catch (error) {
        console.log(error)


    }

}
export default connectDB