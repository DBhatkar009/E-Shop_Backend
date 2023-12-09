const { Registration } = require("../model/registration");
const express = require('express');
const  router = express.Router();



// http://localhost:3000/api/v1/registrations getting data from database
router.get(`/`, async(req, res)=>{
    const registration = await Registration.find();
    res.send(registration);
});


// http://localhost:3000/api/v1/registrations Posting registrations Data to save in database
router.post(`/`, (req, res)=>{
const registration = new Registration({
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  phoneNumber: req.body.phoneNumber,
  dateOfBirth: req.body.dateOfBirth,
  eMailId: req.body.eMailId,
  passWord: req.body.passWord
});
registration.save()
.then(item=> {
  res.status(501).json(item);
})
.catch((err)=>{
  res.status(400).json({
      err: err,
      success: false
  });
})
});


// http://localhost:3000/api/v1/registrations Updatating Registration Data from the database
router.put(`/`, (req, res)=>{
  const registration = new Registration({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    eMailId: req.body.eMailId,
    passWord: req.body.passWord
  });
  registration.save()
  .then(item=> {
    res.status(501).json(item);
  })
  .catch((err)=>{
    res.status(400).json({
        err: err,
        success: false
    });
  })
  });

module.exports = router;