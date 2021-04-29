const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const Category = new Squema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('categories', Category);