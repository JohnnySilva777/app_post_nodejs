const mongoose = require('mongoose');
const Squema = mongoose.Schema;

const User = new Squema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('users', User);