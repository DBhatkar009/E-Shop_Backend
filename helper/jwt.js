
const { expressjwt: jwt } = require("express-jwt");

const authJwt = function (req, res){
    const secret = process.env.secret
    return jwt ({
        secret,
        algorithms: ['HS256']
    })
}

module.exports = authJwt;