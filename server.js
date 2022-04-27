const express = require('express');

const {get, send } = require('express/lib/response');

const app = express();

const port = 3000;

const moveData = require('./Movies-data/data.json');

app.listen(port, () => {
    console.log('we know listen to the app form port 3000');
})


app.get('/', homeHaldler);

app.get('/favorite', favoriteHaldler);


app.use((req, res, next) => {
    res.status(404).send({
        "status": 404,
        "responseText": "Sorry, Not found page 404"
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    })
})


function homeHaldler(req, resp) {

    let move = new Movies(moveData.title, moveData.poster_path, moveData.overview);

    resp.send(move);
}

function Movies(title, poster_path, overview) {

    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}

function favoriteHaldler(request, response) {

    response.send('Welcome to Favorite Page');

}