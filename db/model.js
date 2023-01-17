const db = require(`${__dirname}/connection.js`)
const format = require('pg-format')


const retrieveTopics = () => {

    const sqlQuery = 'SELECT slug, description FROM topics'

    return db.query(sqlQuery).then((results) => results.rows)
}

const retrieveArticles = () => {

    const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS "comment_count"
                        FROM articles
                        LEFT JOIN comments ON articles.article_id = comments.article_id
                        GROUP BY articles.article_id
                        ORDER BY created_at DESC`

    return db.query(sqlQuery).then((results) => results.rows)
}

const retrieveArticleByID = (article_id) => {

    const sqlQuery = `SELECT * FROM articles
                        WHERE article_id = $1`

    return db.query(sqlQuery, [article_id]).then((results) => {
    
        if(results.rows.length === 0) {

            return Promise.reject({status: 404, msg: 'No article with this ID found'})
        } 
        
        return results.rows[0]

    })
}

const retrieveCommentsByArticleID = (article_id) => {

    const sqlQuery = `SELECT * FROM comments
                        WHERE article_id = $1`

    return db.query(sqlQuery, [article_id]).then((results) => {

        if(results.rows.length === 0) {

            return Promise.reject({status: 404, msg: 'There are no comments for this article or no such article exists'})
        }
        
        return results.rows
    })
}

const addCommentByID = (article_id, commentData) => {

    for(let prop in commentData) {

        if(!['username', 'body'].includes(prop)){
            return Promise.reject({status: 400, msg: 'Invalid column names'})
        }
    }
    
    const {username, body} = commentData

    const values = [[body, article_id, username, 0, 'now()']]
        
    const sqlQuery = format(`INSERT INTO comments
                            (body, article_id, author, votes, created_at)
                            VALUES
                            %L
                            RETURNING *`,
                            values)

    return db.query(sqlQuery).then((results) => {
        
        return results.rows[0];
    })
    
}

module.exports = {retrieveTopics, retrieveArticles, retrieveArticleByID, retrieveCommentsByArticleID, addCommentByID}

