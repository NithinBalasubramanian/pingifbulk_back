
const nodemailer = require('nodemailer')
const config = require('../config/mailConfig')

// Mail sender functionality
const sendMailFunction = async (mailDetails) => {
    const mailerTransport = nodemailer.createTransport({
        service: 'gmail',
        host : 'smtp.gmail.com',
        secure : false,
        auth: {
        user: config.mailConfig.userName,
        pass: config.mailConfig.passWord
        }
    });

    const demoDetails = {
        from : "codeplayground123@gmail.com",
        bcc : mailDetails.toMailId,
        // to: ['nithinfurie17@gmail.com', 'nithinmigo1@gmail.com', 'migomike97@gmail.com'],
        subject : mailDetails.subject,
        html : mailDetails.content
      }

      let state = ''

      await mailerTransport.sendMail(demoDetails, (err) => {
        if(err) {
            state = 'failed'
        } else {
            state = 'Sent successfully'
        }
    })
}

module.exports = sendMailFunction
