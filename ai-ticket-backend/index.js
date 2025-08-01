import { ticketCreated } from './inngest/functions/on-ticket-creation.js';
import { onUserSignup } from './inngest/functions/on-signup.js';
import ticketRoute from './routes/ticket.routes.js';  
import userRoute from './routes/user.routes.js';
import { inngest } from './inngest/client.js';
import {serve} from 'inngest/express'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoute)
app.use('/api/tickets', ticketRoute)

app.use(
    '/api/inngest',
    serve({
        client: inngest,
        functions: [onUserSignup, ticketCreated]
    })
);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('CONNECTED TO MONGODB')
    app.listen(PORT, () => {
        console.log(`SERVER RUNNING ON PORT ${PORT}`)
    });
})
.catch((error) => {
    console.log('FAILED TO CONNECT TO MONGODB')
    console.log(error);
})