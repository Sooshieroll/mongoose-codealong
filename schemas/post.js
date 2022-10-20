const mongoose = require('mongoose');


//Schema is bascially model (it is a declaration of what your model is going to look like - like a blueprint for your model)

// Define a schema
// const Schema = mongoose.Schema;

// const commentSchema = new mongoose.Schema({
//     header: String,
//     content: String,
//     date: Date
// });

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    // embedded 
    // comments: [commentSchema],
    // reference
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Post', postSchema);

// make this available to our other files
// module.exports = Post;