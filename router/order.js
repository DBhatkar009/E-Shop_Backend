const { Order } = require("../model/order");
const express = require('express');
const router = express.Router()


// http://localhost:4000/api/v1/orders getting data from database
router.get(`/`, async(req, res)=>{
    const orderList = await Order.find();

    if(!orderList){
      req.status(500).json({success: false})
    }
    res.send(orderList);
});


// Post order Data to save in database
router.post(`/`, (req, res)=>{
    const order = new Order({
     name: req.body.name,
     image: req.body.image,
     countInStock: req.body.countInStock
    });
    order.save()
    .then((item =>{
      res.status(201).json(item);
    }))
    .catch((err)=>{
      res.status(501).json({
         err: err,
         success: false
      })
    })
 });



 // http://localhost:4000/api/v1/orders Deleteing data by id
 router.delete(`/`, async(req, res)=>{
   const deleteItem = await Order.findByIdAndDelete(req.params.id).
   then(deleteItem=>{
    return res.status(202).json({ success: true, message: 'Successfully deleted data' });
   }).catch(err=>{ return res.status(404).send(err) });

 });


module.exports = router;