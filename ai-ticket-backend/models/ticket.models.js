import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'open', 'closed']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    priority: {
        type: String,
        default: 'low',
        enum: ['low', 'medium', 'high']
    },
    dueDate: {
        type: Date,
        default: null
    },
    helpfulNotes: {
        type: String,
        default: null
    },
    relatedSkills: [String]
}, {timestamps:true});

export default Ticket = mongoose.model('Ticket', ticketSchema);