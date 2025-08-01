import inngest from '../client.js';
import User from '../../models/user.models.js';
import { NonRetriableError } from 'inngest';
import { sendMail } from '../../utils/mailer.utils.js';

export const onUserSignup = inngest.createFunction(
    {id: 'on-user-signup', retries: 2},
    {event: 'user/signup'}, 

    async({event, step}) => {
        try {
            const {email} = event.data;
            const user = await step.run('get-user-email', async() => {
                const userObj = await User.findOne({email});
                if(!userObj) {
                    throw new NonRetriableError('User DNE')
                }
                return userObj;
            })

            await step.run('send-welcome-email', async() => {
                const subject = `Welcome to the app`;
                const message = `Hi,
                \n\n
                Thanks for signing up. Glad to have you on the platform!`

                await sendMail(user.email, subject, message);
            })

            return {success: true};
        } catch (error) {
            console.log('Error running step', error.message);
            return {success: false};     
        }
    }
);