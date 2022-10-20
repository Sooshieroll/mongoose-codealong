const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/post');
const User = require('./schemas/user');
// const { Comment } = require('./schemas/comment');
const Comment = require('./schemas/comment');

const mongoDb = 'mongodb://127.0.0.1/mongoose-codealong';
mongoose.connect(mongoDb, { useNewUrlParser: true });

// mainly for visibility to help with errors
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}: ${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false })); // this allows us to use req.body

// Mongoose fetch statements

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our API'
    })
})

app.get('/users', (req, res) => {
    User.find({})
        .then(users => {
            console.log('All users', users);
            res.json({ users: users });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
        .then(user => {
            console.log('Here is the user', user.name);
            res.json({ user: user });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
        .then(user => {
            console.log('New user =>>', user);
            res.json({ user: user });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        });
});

app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
        .then(foundUser => {
            console.log('User found', foundUser);
            User.findOneAndUpdate({ email: req.params.email },
                {
                    name: req.body.name ? req.body.name : foundUser.name,
                    email: req.body.email ? req.body.email : foundUser.email,
                    meta: {
                        age: req.body.age ? req.body.age : foundUser.age,
                        website: req.body.website ? req.body.website : foundUser.website
                    }
                })
                .then(user => {
                    console.log('User was updated', user);
                    res.redirect(`/users/${req.params.email}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })

});

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
        .then(response => {
            console.log('This was deleted', response);
            res.json({ message: `${req.params.email} was deleted` });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" });
        })
});

// ====================== POSTS ROUTES ========================

app.get('/posts', (req, res) => {
    Post.find({})
        .then(posts => {
            console.log('All posts', posts);
            res.json({ posts: posts });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});


app.get('/posts/:id', (req, res) => {

    console.log('find post by ID', req.params.id);

    Post.findById(req.params.id)
        .then(post => {
            console.log('Here is the post', post);
            res.json({ post: post });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
        comments: req.params.comments,
    })
        .then(post => {
            console.log('New post =>>', post);
            res.json({ post: post });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        });
})

app.put('/posts/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findById(req.params.id)
        .then(foundPost => {
            console.log('Post found', foundPost);
            Post.findByIdAndUpdate(req.params.id, {
                title: req.body.title ? req.body.title : foundPost.title,
                body: req.body.body ? req.body.body : foundPost.body
            }, {
                upsert: true
            })
                .then(post => {
                    console.log('Post was updated', post);
                    res.redirect(`/posts/${req.params.id}`)
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })

});

app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log('This was deleted', response);
            res.json({ message: `Post ${req.params.id} was deleted` });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" });
        })
});

// ====================== COMMENTS ROUTES ========================

app.get('/comments', (req, res) => {
    Comment.find()
        .then(comments => {
            console.log('All comments', comments);
            res.json({ comments: comments });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.get('/comments/:id', (req, res) => {
    console.log('find comment by ID', req.params.id)
    // console.log(mongoose.Types.ObjectId(req.params.id))
    Comment.findOne({
        _id: mongoose.Types.ObjectId(req.params.id)
    })
        .then(comment => {
            console.log('Here is the comment', comment);
            res.json({ comment: comment });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.get('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id).populate('comments').exec()
        .then(post => {
            console.log('Hey this is the post', post);
        })
})

app.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            console.log('Heyyy, this is the post', post);
            // create and pust comment inside of post
            Comment.create({
                header: req.body.header,
                content: req.body.content
            })
                .then(comment => {
                    post.comments.push(comment);
                    // save the post
                    post.save();
                    res.redirect(`/posts/${req.params.id}`);
                })
                .catch(error => {
                    console.log('error', error);
                    res.json({ message: "Error ocurred, please try again" });
                });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
});

app.put('/comments/:id', (req, res) => {
    console.log('route is being on PUT')
    Comment.findById(req.params.id)
        .then(foundComment => {
            console.log('Comment found', foundComment);
            Comment.findByIdAndUpdate(req.params.id, {
                header: req.body.header ? req.body.header : foundComment.header,
                content: req.body.content ? req.body.content : foundComment.content,
            }, {
                upsert: true
            })
                .then(comment => {
                    console.log('Comment was updated', comment);
                    res.redirect(`/comments/${req.params.id}`);
                })
                .catch(error => {
                    console.log('error', error)
                    res.json({ message: "Error ocurred, please try again" })
                })
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" })
        })
});




app.delete('/comment/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
        .then(response => {
            console.log('This was deleted', response);
            res.json({ message: `${req.params.id} was deleted` });
        })
        .catch(error => {
            console.log('error', error)
            res.json({ message: "Error ocurred, please try again" });
        })
});

//*********************************************************************** */


app.get('/findAll', (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.send(`Failed to find record, mongodb error ${err}`);
        res.send(users);
    });
})

app.get('/findById/:id', (req, res) => {
    User.findById(req.params.id, (err, users) => {
        if (err) res.send(`Failed to find record byId, mongodb error ${err}`);
        res.send(users);
    })
})
app.get('/findByEmail/:email', (req, res) => {
    User.findOne({ email: req.params.email }, (err, users) => {
        if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
        res.send(users);
    });
})



// creating user directly from model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// });

// const newUser = new User({
//     name: 'created using new User and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('Created New User!');
// })

// Creating a simple post document in he post collection

// Post.create({
//     content: 'This is post content...'
// })

// Mongoose update statements

// User.updateOne({ name: 'Bobby' }, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if (err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// });

// Returns full object prior to update 
// User.findOneAndUpdate({ name: 'Bobby' },
//     {
//         meta: {
//             age: 61,
//             website: 'SomethingDifferent.com'
//         }
//     }, (err, user => {
//         if (err) return console.log(err);
//         console.log(user);
//     })

// Mongoose delete statements (deletes all that match)
// User.remove({ name: 'Bobby' }, (err) => {
//     if (err) return console.log(err)
//     console.group('user record deleted')
// })

// User.findOneAndRemove({ name: 'Chris' }, (err, user) => {
//     if (err) return console.log(err);
//     console.log(user);
// })

// Post schema with association to comments
// const newPost = new Post({
//     title: " our first post",
//     body: 'Some body text for our post',
// })

// newPost.comments.push({
//     header: "our first comment",
//     content: 'this is my comment text',
// })

// newPost.save(function (err) {
//     if (err) return console.log(err)
//     console.log(`Created post`);
// })

// const refPost = new Post({
//     title: 'Post with ref to comments',
//     body: 'Body for ref by comments',
// });

// const refComment = new Comment({
//     header: 'Our ref comment',
//     content: 'Some comment content'
// });
// refComment.save();

// refPost.refComments.push(refComment);
// refPost.save();

// find all comments on a post by ref
Post.findOne({ title: 'our first post' }, (err, post) => {
    Post.findById('post._id').populate('comments').exec((err, post) => {
        console.log(post);
        // Comment.find({ _id: post.refComments[0] }, (err, comment) => {
        //     console.log(comment);
    })
});




app.listen(8000, () => {
    console.log('Running port 8000....')
})