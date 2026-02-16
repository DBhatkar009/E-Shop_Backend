const { Product } = require("../model/product");
const { Categorie } = require("../model/categorie");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split("").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// http://localhost:4000/api/v1/products getting data from database
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("categorie");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

//localhost:4000/api/v1/products getting data by id from database and also populate categorie
// router.get(`/:id`, async (req, res) => {
//   const prod = await Product.findById(req.params.id).populate("categorie");

//   if (!prod) {
//     return res.status(400).send("unsuccessfully populate data from category");
//   }

//   res.send(prod);
// });

// http://localhost:4000/api/v1/products getting data by select perticular name from database
// router.get(`/`, async(req, res)=>{
//   const prod = await Product.find().select('name').populate('categorie');

//   if(!prod){
//     return res.status(404).send("something went wrong");
//   }

//   res.status(202).send(prod);

// })

// Post products Data to save in database
http: router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const cat = Categorie.findById(req.params.cat);
  if (!cat) return res.status(404).send("categorie id unsuccessfully created");

  const file = req.file;
  if (!file) return res.status(404).send("no image in the request");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    categorie: req.body.categorie,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
    countInStock: req.body.countInStock,
  });
  product = await product
    .save()
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((err) => {
      res.status(501).json({
        err: err,
        success: false,
      });
    });
});

// http://localhost:4000/api/v1/products Updateing a data by id from database
router.put(`/:id`, uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("invalid product Id");
  }
  const categ = Categorie.findById(req.body.categ);
  if (!categ)
    return res.status(404).send("categorie id unsuccessfully created");

  const product = Product.findById(req.body.product);
  if (!product)
    return res.status(404).send("product id unsuccessfully created");

  let imagePath;
  const file = req.file;

  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = product.image;
  }

  let updatedPro = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      categorie: req.body.categorie,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
      countInStock: req.body.countInStock,
    },
    {
      new: true,
    },
  )
    .then((updatedPro) => {
      return res.status(210).send(updatedPro);
    })
    .catch((err) => {
      return res.status(420).send(err.message);
    });
});

// http://localhost:4000/api/v1/products/65780802c68f6ad52f563ebe deleted data by findByIdAndRemove
router.delete("/:id", async (req, res) => {
  const deletedItem = await Product.findByIdAndRemove(req.params.id)
    .then((deletedItem) => {
      return res
        .status(202)
        .json({ success: true, message: "deleted product item successfully" });
    })
    .catch((err) => res.status(400).send(err.message));
});

//http://localhost:4000/api/v1/products/get/count this api using for getting exact no of count product currently not working unable to fix
router.get(`/get/count`, async (req, res) => {
  const userCountProduct = await Product.countDocuments((count) => count);
  if (!userCountProduct) {
    return res.json({ success: false, message: "something went wrong" });
  }
  res.send({ userCountProduct: userCountProduct });
});

//http://localhost:4000/api/v1/products/get/featured/9 this api using for getting exact no of count product isFeatured: true
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);
  if (!products) {
    res.send("product is not with featured");
  }
  res.send(products);
});

// http://localhost:4000/api/v1/products?categorie=657ad777bea7ec47e07b9475,65780d203d7e85d97e7cd7cc filter to split the categorie from product tabel
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categorie) {
    filter = { categorie: req.query.categorie.split(",") };
  }
  const data = await Product.find(filter).populate("categorie");
  if (!data) {
    return res.status(404).send("something went wrong");
  }
  res.status(202).send(data);
});

//http://localhost:4000/api/v1/products/gallery-images/:id this api is only for updating multiple images
router.put(
  `/gallery-images/:id`,
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("invalid product Id");
    }
    let imagesPath = [];
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    if (files) {
      files.map((file) => {
        imagesPath.push(`${basePath}.${file.fileName}`);
      });
    }

    let pro = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPath,
      },
      {
        new: true,
      },
    )
      .then((pro) => {
        return res.status(210).send(pro);
      })
      .catch((err) => {
        return res.status(420).send(err.message);
      });
  },
);

module.exports = router;
