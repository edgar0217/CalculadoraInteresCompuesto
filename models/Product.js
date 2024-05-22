const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    producto:{
        type:String,
        required:true
    },
    costoinicial:{
        type:Number,
        required:true
    }

});

const User = mongoose.model('Product',ProductSchema);
module.exports  = Product;
