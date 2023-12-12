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

router.get(`/:id`, async(req, res)=>{
   const category = await Categorie.findById(req.params.id);
   if(!category){
     return req.status(404).send("Not found category by id data");
   }
   res.send(category);
})

// created new category data / added new data in category 
router.post(`/`, async(req, res)=>{
  let category = new Categorie({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.icon
  });

  category = await category.save();

  if(!category){
    return req.status(201).json({success: false, message: 'sorry categorie is not created'});
  }
  res.send(category);
});


// delete category data by id using this method from course
router.delete('/:id',async (req, res) => {
  const deletedItem = await Categorie.findByIdAndRemove(req.params.id)
  .then(deletedItem=>{
      return res.status(202).json({ success: true, message: "deleted category item successfully" });
  })
  .catch(err => res.status(400).send(err.message));

})


module.exports = router;