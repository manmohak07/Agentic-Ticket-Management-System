// import User from '../models/user.models.js'
import Ticket from '../models/ticket.models.js'
import {inngest} from '../inngest/client.js'

export const createTicket = async(req, res) => {

    try {
        const {title, description} = req.body;

        if(!title || !description) return res.status(400).json({message: 'Title and description required'});

        const newTicket = Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
            
        })

        await inngest.send({
            name: 'ticket/create',
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });

        return res.status(200).json({message: 'Ticket created successfully'});
        ticket: newTicket;
    } catch(error) {
        consolge.log("Error creating ticket", error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const getTickets = async(req, res) => {
    try {
        const user = req.user;
        let tickets = []
        if(user.role !== 'user') {
            tickets = await Ticket.find({}).
            populate('assignedTo', ['email', '_id'])
            .sort({createdAt: -1});
        } else {
            tickets = await Ticket.find({createdBy: user._id})
            .select('title description status createdAt')
            .sort({createdAt: -1});
        }
        return res.status(200).json(tickets);
    } catch (error) {
        consolge.log("Error fetching tickets", error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const getTicket = async(req, res) => {
    try {
        const user = req.user;
        let ticket;
        if(user.role !== 'user') {
            ticket = await Ticket.findById(req.params.id).populate('assignedTo', ['email', '_id']);
        } else {
            ticket = await Ticket.findOne({
                _id: req.params.id,
                createdBy: user._id
            })
        }
        if(!ticket) return res.status(404).json({message: 'Ticket not found'});
        return res.status(200).json(ticket);
    } catch (error) {
        consolge.log("Error fetching ticket", error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}