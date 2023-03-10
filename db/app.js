const { response } = require('express');
const express = require('express');
const cors = require('cors');
const {getTopics, getArticles, getArticleByID, getCommentsByArticleID, postCommentByArticleID, patchArticleByID, getUsers, deleteCommentByID, getAPI} = require(`${__dirname}/controller.js`);



const app = express()

app.use(cors());
app.use(express.json());


app.get('/api', getAPI);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postCommentByArticleID)

app.patch('/api/articles/:article_id', patchArticleByID)

app.delete('/api/comments/:comment_id', deleteCommentByID)


app.use((request, response, next) => {

    response.status(404).send({msg: 'Path not found'})
})

app.use((error, request, response, next) => {

    if(error.status && error.msg) {

        response.status(error.status).send({msg: error.msg})
    } 
    else if(error.code === '23503') {

                response.status(404).send({msg: 'This ID does not exist'})
    }
    else {
        next(error)
    }
}) 

app.use((error, request, response, next) => {
    console.log(error);
    response.status(404).send({msg: 'Something went wrong'})
})

module.exports = app