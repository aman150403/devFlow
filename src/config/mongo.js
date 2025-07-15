import mongoose from 'mongoose';

const connectDB = async function () {
    const mongoUri = process.env.MONGO_URI;
    if(!mongoUri){
        console.log('MONGO_URI is not there in enviorment variable');
        process.exit(1);
    } 

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected')
    } catch (error) {
        console.error('Error in MondoDB connection', error);
        process.exit(1);
    }
}

export { connectDB }