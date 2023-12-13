const { User } = require('../model/user');
const express = require('express');
const router = express.Router();


// http://localhost:4000/api/v1/users getting data from database
router.get('/', async(req,res) => {
    const userList = await User.find();

    if(!userList){
        req.status(500).json({sucess: false});
    }
    res.send(userList);
})


router.post('/', async(req,res)=>{
    const user = new User({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    user.save()
    .then((item =>{
        res.status(201).json(item);
    }))
    .catch((err)=>{
        res.status(501).json({
            error: err,
            success: false
        })
    })
})


module.exports = router;