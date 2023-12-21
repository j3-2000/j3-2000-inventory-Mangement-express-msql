import  nodemailer from  'nodemailer';
import pug from 'pug'; 
import { fileURLToPath, pathToFileURL } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

const SendMail=(mail)=>{
  const templatePath = path.join(__dirname, '../view', 'email.pug');
  var compiledFunction = pug.compileFile(templatePath);


  var htmlContent = compiledFunction();

var mailOptions = {
  from: `"TESTING" <${process.env.EMAIL_USER}>`,
  to: mail,
  subject: 'Reset Pasword',
  html: htmlContent
};

    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

export default SendMail