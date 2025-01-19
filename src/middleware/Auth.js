const jwt = require('json-web-token')
const jwtKey = require('../config/jwtConfig')

// Verify token middleware
const Auth = ((req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null ){ 
        return res.json({
            msg: 'Invalid Token',
            status: 401,
            error: 'Token is null',
            success: false
        })
    }

    const secret = jwtKey.jwtSupport.secretKey;
    jwt.decode(secret, token, function (err, decodedPayload, decodedHeader) {
        if (err) {
          console.error(err.name, err.message);
          return res.json({
            msg: `Invalid Token `,
            error: err.message,
            status: 401,
            success: false
        })
        } else {
          console.log(decodedPayload);
          req.user = decodedPayload
          // res.json(req)
        }
      });       

    next()
})

module.exports = Auth