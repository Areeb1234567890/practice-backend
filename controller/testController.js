const USER = require("../models/customers");
const PRODUCT = require("../models/product");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      message: "Missing fields: email, name, or password",
    });
  }

  try {
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
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addProduct = async (req, res) => {
  const { name, category, customer, price } = req.body;

  if (!category || !name || !customer || !price) {
    return res.status(400).json({
      message: "Missing data",
    });
  } else {
    const product = await PRODUCT.create({
      productName: name,
      productPrie: price,
      customer,
      category,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: product,
    });
  }
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

module.exports = { registerUser, addProduct, getProduct };
