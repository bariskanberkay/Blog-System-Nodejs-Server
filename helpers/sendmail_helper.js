const nodemailer = require('nodemailer');
const config = require('../email_config.json');

module.exports = emailer;

function emailer({to,subject,html,from = config.emailFrom}){
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({from,to,subject,html});
}