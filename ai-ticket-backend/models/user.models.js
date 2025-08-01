import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'moderator']
    }, 
    skills: [String]
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, {timestamps:true});

export default User = mongoose.model('User', userSchema);