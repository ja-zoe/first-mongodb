const express = require('express')
const app = express()
const Product = require('./models/product.model')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('This is the root path')
})

app.get('/api/products', async (req, res) => {
    try {
        const Products = await Product.find({})
        res.status(200).json(Products)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.put('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body)
        if (!product) {
            res.status(404).json({message: "Product not found"})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json([
            {
                "Product State": 'Original Product',
                "Product": product
            },
            {
                "Product State": "Updated Product",
                "Product": updatedProduct
            }
        ])
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/api/products', async (req, res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)
        if ( !product ){
            res.status(404).json({message: "Product not Found"})
        }
        res.status(200).json({message: "Product Deletion Successful"})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_KEY}@backenddb.aui0t1v.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB`)
.then(() => {
    console.log("Connected to database!")
    app.listen(3000, () => {
        console.log(`Server running on port 3000`)
    })
})
.catch(() => {
    console.log("Connection Failed")
})