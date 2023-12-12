const { Categorie } = require("../model/categorie");
const express = require('express');
const router = express.Router()


// http://localhost:4000/api/v1/categories getting data from database
router.get(`/`, async(req, res)=>{
    const categorieList = await Categorie.find();

    if(!categorieList){
      req.status(500).json({success: false})
    }
    res.send(categorieList);
});



module.exports = router;