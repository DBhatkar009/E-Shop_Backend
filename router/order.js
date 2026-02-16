const { Order } = require("../model/order");
const { User } = require("../model/user");
const { OrderItem } = require("../model/order-item");
const express = require("express");
const { populate } = require("dotenv");
// const { isObjectIdOrHexString } = require("mongoose");
const router = express.Router();

// http://localhost:4000/api/v1/orders getting data from database and also populate User and OrderItems
router.get(`/`, async (req, res) => {
  const orderList = await Order.find().populate("user").sort({dateOrdered: -1}).populate({path: 'orderItems', populate: "product" })
  if(!orderList){
    return res.status(402).json({success: false, message: err});
  }
  res.send(orderList);
});


// http://localhost:4000/api/v1/orders getting data by Id from database and also populate User and OrderItems
router.get(`/:id`, async (req, res)=>{
  const orderByID = await Order.findById(req.params.id).populate('user').populate({path: 'orderItems', populate: {path: 'product', populate: 'categorie'}});

  if(!orderByID){
   return res.status(400).json({success: false, message: err});
  }
  res.status(200).send(orderByID);
})


// http://localhost:4000/api/v1/orders Saving a data in mongodb database
router.post(`/`, async(req, res) => {

  const orderItemsRoll = Promise.all(req.body.orderItems.map(async orderItem=>{
    let newOrderItems = new OrderItem({
      product: orderItem.product,
      quantity: orderItem.quantity
    })

    newOrderItems = await newOrderItems.save();
    return newOrderItems._id;
  }))
  const orderItemsResolved = await orderItemsRoll;

  const totalPrices = await Promise.all(orderItemsResolved.map(async (item) =>{
    const orderItem = await OrderItem.findById(item).populate('product','price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice;
  }))

  const totalPrice = totalPrices.reduce((a, b)=> a+b, 0 );
  // console.log(orderItemsResolved);
  const use = User.findById(req.params.use);
  if (!use) return res.status(404).send("User id unsuccessfully created");
  const order = new Order({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    status: req.body.status,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });
  order.save()
    .then((order) => {
      res.status(201).json(order);
    })
    .catch((err) => {
      res.status(501).json({
        err: err,
        success: false,
      });
    });
});


//http://localhost:4000/api/v1/orders/663b55dad9cf861c0e8ebc7e updating orders status method
router.put(`/:id`, async(req, res)=>{
  let orderUp = await Order.findByIdAndUpdate(
    req.params.id,
   {
     status: req.body.status,
   }
  ).then(orderUp=>{
      return res.status(200).send(orderUp);
  }).catch(err=>{
   return res.status(400).json({ success: false, message: err });
  })
})

// http://localhost:4000/api/v1/orders Deleteing data by id
// router.delete(`/:id`, async (req, res) => {
//   const deleteItem = await Order.findByIdAndDelete(req.params.id).
//   then((deleteItem => {
//     if(deleteItem){
//       return res.status(200).json({ success: true, message: 'Successfully deleted selected OrderID' })
//     }
//     else{
//       return res.status(400).json({ success: false, message: "Unsuccessfully deleted selected OrderId" })
//     }
//   })).
//   catch((err => {
//     return res.status(500).json({ message: 'something went wrong', error: err });
//   }))
// });


// http://localhost:4000/api/v1/orders Deleteing data by id with OrderItems 
router.delete(`/:id`, async (req, res) => {
  let deleteItem = await Order.findByIdAndDelete(req.params.id).
  then((async deleteItem => {
    if(deleteItem){
       await deleteItem.orderItems.map(async orderItem =>{
        await OrderItem.findByIdAndDelete(orderItem)
       })   
       return res.status(200).json({ success: true, message: "Successfully deleted Order With Order Items" });
    } else{
      return res.status(400).json({ success: false, message: "Unsuccessfully deleted Order With Order Items" });
    }
  })).
  catch((err => {
    return res.status(500).json({ message: 'something went wrong', error: err });
  }))
});


//http://localhost:4000/api/v1/products/get/count this api using for getting exact no of count Order currently not working unable to fix
router.get(`/get/count`, async(req, res) => {
  const userCountOrder = await Order.countDocuments((count) => count);
  if (!userCountOrder) {
    return res.json({ success: false, message: "something went wrong" });
  }
  res.send({ userCountOrder: userCountOrder });
});



//http://localhost:4000/api/v1/products/get/totalSales this api using for getting total sales count Order
router.get(`/get/totalSales`, async(req, res) =>{
  const totalSales = await Order.aggregate([
    { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
])

  if(!totalSales){
    return res.status(500).json({ success: false, message: "something went wrong" });
  }

  res.status(200).send({totalsales: totalSales.pop().totalsales})
})

//http://localhost:4000/api/v1/orders/get/userorder/:userid this api using for getting only perticular order that order by perticular user  
router.get(`/get/userorder/:userid`, async(req, res) =>{
  const orderByUser = await Order.find(req.params.id).populate({path: 'orderItems', populate: {path: 'product', populate: 'categorie'}}).sort({dateOrdered: -1}).then((orderByID)=>{
      res.status(200).send(orderByID); 
  }).catch((err => {
    res.status(500).json({error: err, message: "unsuccessfull get user by order details"});
  }))
})


module.exports = router;
