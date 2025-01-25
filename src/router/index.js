const UserRouter = require('./users')
const MailerRouter = require('./mailer')
const ConsumerRouter = require('./consumers')
const TeamRouter = require('./team')
const ClientRouter = require('./client')
const EmployeeRouter = require('./employee')

module.exports = {
    UserRouter,
    MailerRouter,
    ConsumerRouter,
    ClientRouter,
    TeamRouter,
    EmployeeRouter
}