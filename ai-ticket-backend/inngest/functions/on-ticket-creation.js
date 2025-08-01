import inngest from '../client.js';
import Ticket from '../../models/ticket.models.js';
import User from '../../models/user.models.js';
import { NonRetriableError } from 'inngest';
import { sendMail } from '../../utils/mailer.utils.js';
import analyzeTicket from '../../utils/ai.utils.js';

export const ticketCreated = inngest.createFunction(
    {id: 'ticket-created', retries: 2},
    {event: 'ticket/create'}, 

    async({event, step}) => {
        try {
            const {ticketId} = event.data;
            
            const ticket = await step.run('get-ticket-id', async() => {
                const ticketObj = await Ticket.findById(ticketId);
                if(!ticketObj) {
                throw new NonRetriableError('Ticket DNE');
            } 

                return ticket;
            })

            await step.run('Update-ticket-status', async() => {
                await Ticket.findByIdAndUpdate(ticket._id, {status: "TODO"});
            })

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills =  await step.run('ai-processing', async() => {
                let skills = []

                if(aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !['low', 'medium', 'high'].includes(aiResponse.priority) ? 'medium' : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: 'IN PROGRESS',
                        relatedSkills: aiResponse.relatedSkills
                    })
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            })

            const moderator = await step.run('assign-mod', async() => {
                let user = User.findOne({
                    role: 'moderator',
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        },
                    },
                });
                if(!user) {
                    user = await User.findOne({role: 'admin'});
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null
                })

                return user;
            });  

            await step.run('send-email-notification', async() => {
                if(moderator) {
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendMail(
                        moderator.email,
                        'New Ticket Assigned - Notification',
                        `Dear ${moderator.email},
                        
                        A new ticket with ID ${finalTicket.title} has been created and has been assigned to you.
                        `
                    )
                }
            })

            return {success: true};

        } catch(error) {
            console.log('Error running step', error.message);
            return {success: false};
        }
    }
);