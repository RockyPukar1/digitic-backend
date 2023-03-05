const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
        unique: true,
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        default: "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-260nw-1029506242.jpg"
    },
    author: {
        type: String,
        default: "Admin" 
    }
}, {
    toJSON: {
        virtuals: true
    }, 
    toObject:{
        virtuals: true
    },
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);