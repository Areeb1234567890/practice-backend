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
    productCategory: category,
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

const getOrders = async (req, res) => {
  const orderProductfromLookup = await ORDER.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "Customer",
        foreignField: "_id",
        as: "Customer",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "Products.productDetail",
        foreignField: "_id",
        as: "Products",
      },
    },
  ]);

  // const orders = await ORDER.find()
  //   .populate({
  //     path: "Customer",
  //     select: "-password -__v -_id",
  //   })
  //   .populate({
  //     path: "Products.productDetail",
  //     select: "productName productPrie -_id",
  //   });

  return res.status(201).json({
    message: "Orders fetch successfully",
    // orders,
    orderProductfromLookup,
  });
};

const getProduct = async (req, res) => {
  const searchText = req?.query?.searchText;
  const currentPage = Number(req?.query?.currentPage) || 1;
  const itemPerPage = Number(req?.query?.itemPerPage) || 5;
  const searchQuery =
    searchText && searchText !== "undefined" && searchText !== "null"
      ? searchText
      : "";
  const query = {
    $and: [],
  };
  query.$and.push({
    $or: [
      { productName: { $regex: new RegExp(searchQuery, "i") } },
      { productCategory: { $regex: new RegExp(searchQuery, "i") } },
    ],
  });

  const totalPages = Math.ceil(
    (await PRODUCT.countDocuments(query)) / itemPerPage
  );
  const totalItems = await PRODUCT.countDocuments(query);
  const products = await PRODUCT.find(query)
    .lean()
    .skip((currentPage - 1) * itemPerPage)
    .limit(itemPerPage);

  return res.status(201).json({
    message: "product retrived successfully",
    products,
    lastPage: totalPages,
    totalItems,
    currentPage,
    itemPerPage,
  });
};

module.exports = {
  registerUser,
  addProduct,
  getOrders,
  orderProduct,
  getProduct,
};
