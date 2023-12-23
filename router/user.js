const { User } = require('../model/user');
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// http://localhost:4000/api/v1/users getting data from database
router.get('/', async(req,res) => {
    const userList = await User.find();

    if(!userList){
        req.status(500).json({sucess: false});
    }
    res.send(userList);
})


// http://localhost:4000/api/v1/users getting data base on user Id from database
router.get(`/:id`, async(req,res)=>{
    const userId = await User.findById(req.params.id).select('-passwordHash');

    if(!userId){
        return res.status(403).json({
            success: false,
            message: err
        })
    }
    res.send(userId);
})


// http://localhost:4000/api/v1/users creating new data for user in Database
router.post('/', async(req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        city: req.body.city,
        apartment: req.body.apartment,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,

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


// http://localhost:4000/api/v1/users Updateing a data by id with password/without password from database 
router.put(`/:id`, async(req, res)=>{
  const userExist = await User.findById(req.params.id);  
 let passHash
 if(req.body.passwordHash){
    passHash = bcrypt.hashSync(req.body.passwordHash, 10);       
 }  else {
    passHash =  userExist.passwordHash;
 }  
    let Use = await User.findByIdAndUpdate(
      req.params.id,
     {
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: passHash,
        city: req.body.city,
        apartment: req.body.apartment,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
     },
     {
        new: true
     }
    ).then(use=>{
        return res.status(210).send(use);
    }).catch(err=>{
     return res.status(420).send(err.message);
    })
  })


  router.post(`/login`, async(req, res)=>{
    const email= await User.findOne({email: req.body.email})
    if(!email){
       return res.status(202).send('unable to login user');
    }

    if(email &&  bcrypt.compareSync(req.body.passwordHash, email.passwordHash)){
        const token = jwt.sign(
            {
                userId: email.id
            },
            'secret',
            {
                expiresIn: '1d'
            }

        )
        res.status(202).send({user: email.email, token: token });
    }
    else {
        res.status(403).send('password not match');
    }
    res.send(email)
  })




  //http://localhost:4000/api/v1/users/657d6cfb15b7a77d9fdc0100 delete api findByIdRemove
  router.delete(`/:id`, async(req, res)=>{
     const item = await User.findByIdAndRemove(req.params.id)
     .then((item)=>{ 
        return res.send('successfully removed from user'); 
    }).catch(()=>{ 
        return res.status(400).send('unable to delete this user'); 
    })
  })

  

module.exports = router;