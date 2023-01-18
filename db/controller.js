const {retrieveTopics, retrieveArticles, retrieveArticleByID, retrieveCommentsByArticleID, addCommentByID} = require(`${__dirname}/model.js`)



const getTopics = (request, response, next) => {

    retrieveTopics().then((topics) => {

        response.status(200).send({topics: topics});
    })
    .catch((err) => {
        next(err);
    })
}

const getArticles = (request, response, next) => {

    retrieveArticles().then((articles) => {

        response.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err);
    })
}

const getArticleByID = (request, response, next) => {
    const {article_id} = request.params;

    retrieveArticleByID(article_id).then((article) => {
        
        response.status(200).send({article: article})

    })
    .catch((error) => {

        next(error)
    })
}

const getCommentsByArticleID = (request, response, next) => {
    const {article_id} = request.params;

    retrieveCommentsByArticleID(article_id).then((comments) => {

        response.status(200).send({comments: comments})
    })
    .catch((error) => {

        next(error)
    })
}

const postCommentByArticleID = (request, response, next) => {
    const {article_id} = request.params;
    const {body} = request;

    addCommentByID(article_id, body).then((comment) => {
        
        response.status(201).send({comment: comment});
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getTopics, getArticles, getArticleByID, getCommentsByArticleID, postCommentByArticleID}
