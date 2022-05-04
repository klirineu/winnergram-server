import nodemailer from 'nodemailer';
import transportMailer from '../configs/transport';

export default nodemailer.createTransport(transportMailer);