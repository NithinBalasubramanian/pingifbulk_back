
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

    // const mailerTransport = nodemailer.createTransport({
    //     host: 'smtp.hostinger.com ',
    //     secure: true,
    //     secureConnection: false,
    //     port: 465,
    //     debug: true,
    //     connectionTimeout: 10000,
    //     auth: {
    //         user: 'pingifbulk-dev@indoglobaledu.com',
    //         pass: 'Nithin@123'
    //     }
    // });

    const demoDetails = {
        from : "pingifbulk-dev@indoglobaledu.com",
        bcc : mailDetails.toMailId,
        // to: ['nithinfurie17@gmail.com', 'nithinmigo1@gmail.com', 'migomike97@gmail.com', 'pingifbulk-dev@indoglobaledu.com'],
        subject : mailDetails.subject,
        html : mailDetails.content
      }

      let state = ''

      await mailerTransport.sendMail(demoDetails, (err) => {
        if(err) {
            console.log(err);
            state = 'failed'
        } else {
            state = 'Sent successfully'
        }
    })
}

module.exports = sendMailFunction
