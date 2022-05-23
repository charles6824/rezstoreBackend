import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 20
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : req.query.category ?
     {category: req.query.category}:
     req.query.brand ? 
     {brand: req.query.brand}:{}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword }).sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    if(product.price >= 1 && product.price <= 10000){
      product.price = product.price + (0.2 * product.price) +3500
      res.json(product)
    }
    else if(product.price >= 10001 && product.price <= 30000){
      product.price = product.price + (0.2 * product.price) +7000
      res.json(product)
    }
    else if(product.price >= 30001 && product.price <= 60000){
      product.price = product.price + (0.2 * product.price) +10000
      res.json(product)
    }
    else if(product.price >= 60001 && product.price <= 100000){
      product.price = product.price + (0.2 * product.price) +20000
      res.json(product)
    }
    else if(product.price >= 100001){
      product.price = product.price + (0.2 * product.price) +35000
      res.json(product)
    }
    // else{
    //   res.json(product)
    // }
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Brand',
    category: 'Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Basic Description', 
    features: 'All features.'
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    features
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.features = features

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(8)
  if(products){
    res.json(products)
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})

const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(4)
  if(products.length > 0){
    res.json(products)
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})

const getCatProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({category: req.params.categoryName}).sort({ rating: -1 }).limit(4)
  if(products.length > 0){
    res.json(products)
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})
const getBrandProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({brand: req.params.brandName}).sort({ rating: -1 }).limit(4)
  if(products.length > 0){
    res.json(products)
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})


const getNewArrivals = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1
  const count = await Product.countDocuments({})
  const products = await Product.find({}).sort({ createdAt: -1 })
  .limit(pageSize)
  .skip(pageSize * (page - 1))

  if(products.length > 0){
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }

})

const getProductsCategory = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1
  const count = await Product.countDocuments({category: req.params.categoryName})
  const products = await Product.find({category: req.params.categoryName})
 
  .limit(pageSize)
  .skip(pageSize * (page - 1))

  if(products.length > 0){
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})

const getProductsBrand = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1
  const count = await Product.countDocuments({brand: req.params.brandName})
  const products = await Product.find({brand: req.params.brandName})
 
  .limit(pageSize)
  .skip(pageSize * (page - 1))

  if(products.length > 0){
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }else{
    res.status(400)
    throw new Error('No product in the database')
  }
})


export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getNewProducts,
  getNewArrivals,
  getProductsCategory,
  getProductsBrand,
  getCatProducts,
  getBrandProducts,
};
