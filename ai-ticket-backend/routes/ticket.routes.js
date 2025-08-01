import express from 'express'

import { authenticate } from '../middlewares/auth.js';
import { createTicket, getTicket, getTickets } from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/create', authenticate, createTicket);
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicket);

export default ticketRoute;