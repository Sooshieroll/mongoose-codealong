const mongoose = require('mongoose');

//Schema is bascially model (it is a declaration of what your model is going to look like - like a blueprint for your model)

const commentSchema = new mongoose.Schema({
    header: String,
    content: String,
    date: Date
});

module.exports = {
    Comment: mongoose.model('Comment', commentSchema),
    commentSchema
}