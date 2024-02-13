

function errorHandler(err, req, res, next){

    if(err.name === 'UnauthorizeError'){
       return res.status(401).json({ message: "the User is Unauthorized" });
    }

    if(err.name === 'ValidationError'){
       return res.status(401).json({ message: err });
    }

    return res.status(500).json(err);
}

module.exports = errorHandler;