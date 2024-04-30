const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error, Console } = require("console");
const { redirect } = require("react-router-dom");
const { type } = require("os");
const { request } = require("http");

app.use(express.json());
app.use(cors());

//database connection with mongoDb
mongoose.connect(
  "mongodb+srv://samriddhimaurya9005:900900@cluster0.ud6tm1o.mongodb.net/ecommerce1"
);

//API creation
app.get("/", (req, res) => {
  res.send("express app is running");
});

// image stroge engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//creating upload endpoint for  images
app.use("/images", express.static("/upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//creating api for deleting product

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//creating api for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});

//schema creating for user model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating end point for registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "existing user found , with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});


//creating endpoint for user login

app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email }); 
  if (user) {
    const passCompare = req.body.password === user.password; 
    if (passCompare) {
      const data = {
        user: {
          id:user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom'); 
      res.json({success:true, token})
    }
    else {
      res.json({ success: false, errors: "Wrong password" }); 
    }
  }
  else {
    res.json({success:false , errors:"Wrong Email Id" })
  }
})

//creating endpoint for new collextions
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fetched");
  res.send(newcollection);
});

//creating end point for popular in women
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4);
  console.log("popular in women fetched");
  res.send(popular_in_women);
});


//creating endpoint for adding products in cart data
app.post('/addtocart', async (req , res) => {
  console.log(req.body); 
})


app.listen(port, (error) => {
  if (!error) {
    console.log("server ruuning on " + port);
  } else {
    console.log("error:" + error);
  }
});
