const mongoose = require('mongoose');


const movieShema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    rentPrice: {
        type: Number,
        require: true,
    },
});

const Movie = mongoose.model('movie', movieShema);

module.exports = Movie;