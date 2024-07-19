const USER = require("../models/customers");
const PRODUCT = require("../models/product");
const ORDER = require("../models/orders");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
  const { email, name, password, gender, age } = req.body;

  if (!email || !name || !password || !gender || !age) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const userExist = await USER.findOne({
    $or: [{ userEmail: email }, { userName: name }],
  });

  if (userExist) {
    return res.status(400).json({
      message:
        "An account is already available with the provided email or name",
    });
  }

  const newUser = await USER.create({
    userEmail: email,
    userName: name,
    password: password,
    gender,
    age,
  });

  return res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
};

const addProduct = async (req, res) => {
  const { name, category, price, quantity } = req.body;

  if (!category || !name || !price || !quantity) {
    return res.status(400).json({
      message: "Missing data",
    });
  }

  const productExist = await PRODUCT.findOne({
    productName: name,
  });

  if (productExist) {
    return res.status(400).json({
      message: "Product already exist",
    });
  }

  const product = await PRODUCT.create({
    productName: name,
    productPrie: price,
    totalQuantity: quantity,
    category,
  });

  return res.status(201).json({
    message: "Product created successfully",
    product: product,
  });
};

const orderProduct = async (req, res) => {
  const { userId } = req.params;
  const { products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({
      message: "No product Selected",
    });
  }

  for (const Product of products) {
    await PRODUCT.findOneAndUpdate(
      {
        _id: Product.productDetail,
        totalQuantity: { $gte: Product.quantity },
      },
      {
        $inc: {
          totalQuantity: -Product.quantity,
          quantitySold: Product.quantity,
        },
      }
    );
  }

  await ORDER.create({
    Customer: userId,
    Products: products,
  });

  return res.status(201).json({
    message: "Product orders successfully",
  });
};

const getProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await PRODUCT.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(productId) },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customerDetails",
      },
    },
    {
      $addFields: {
        customer: { $arrayElemAt: ["$customerDetails", 0] },
      },
    },
    {
      $project: {
        customerDetails: 0,
      },
    },
  ]);

  if (!product || product.length === 0) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.status(200).json({
    message: "Product found",
    product: product,
  });
};

module.exports = { registerUser, addProduct, getProduct, orderProduct };
