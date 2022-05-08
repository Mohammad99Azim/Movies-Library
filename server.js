'use strict';

const express = require('express');

const cors = require('cors')
const app = express();
const port = 3000;
const moveData = require('./Movies-data/data.json');
const { default: axios } = require('axios');
require("dotenv").config();

let db_url = "postgres://mohammad:123456789@localhost:5432/moves";

const bodyParser = require('body-parser');




let apiKey = process.env.API_KEY;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { Client } = require('pg');
const client = new Client(db_url);





app.get('/', homeHanldler);
app.get('/favorite', favoriteHanldler);


app.get('/trending', trendingHandler);
//to get trend moves : http://localhost:3000/trending

app.get('/search', searchMove);
//to search in moves : http://localhost:3000/search?name=m

app.get('/person', personHandler);
//to get trend person : http://localhost:3000/person

app.get('/personsearch', searchPerson);
// to search on person : http://localhost:3000/personsearch?personname=n

app.post('/addMovie', addMovieHandler);
// to add Movie : http://localhost:3000/addMovie


app.get('/getMovies', getMoviesHandler);


function addMovieHandler(req, res) {

    let { id, title, releasedate, posterpath } = req.body;

    let sql = 'INSERT INTO themove (id,title, releasedate ,posterpath) VALUES ($1, $2, $3, $4) RETURNING * ;';
    let values = [id, title, releasedate, posterpath];

    client.query(sql, values).then((result) => {
        console.log(result);
        return res.status(201).json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    });

}

function getMoviesHandler(request, response) {
    let sql = `SELECT * FROM themove ;`;
    client.query(sql).then((result) => {
        console.log(result);
        response.json(result.rows);
    }).catch((err) => {
        handleError(err, request, response);
    })

}

client.connect().then(() => {
    app.listen(port, () => {
        console.log('we know listen to the app form port 3000');
    });
})

function trendingHandler(request, response) {

    let apiURL = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

    axios.get(apiURL)
        .then(result => {

            let trendMove = result.data.results.map((ternd) => {
                return new Trend(
                    ternd.id,
                    ternd.title,
                    ternd.release_date,
                    ternd.poster_path,
                    ternd.overview,
                );
            });
            response.send(trendMove);
        })
        .catch((error => {
            console.log(error);
            response.send("error in getting data from API")
        }))
}


function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function searchMove(request, response) {

    let nameew = request.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${nameew}`;

    axios.get(url).then((result) => {

        let trendMove = result.data.results.map((ternd) => {
            return new Trend(
                ternd.id,
                ternd.title,
                ternd.release_date,
                ternd.poster_path,
                ternd.overview
            );
        });
        response.send(trendMove);

    }).catch((error => {
        console.log(error);
        response.send("error in getting data from API search")
    }))
}




function personHandler(request, response) {

    let url = `https://api.themoviedb.org/3/trending/person/week?api_key=${apiKey}`;

    axios.get(url).then((result) => {

        let person = result.data.results.map((theresult) => {

            return new Person(theresult.id, theresult.name, theresult.gender);

        })



        response.json(person);

    }).catch((error => {
        console.log(error);
        response.send("error in getting data from API search")
    }))
}


function searchPerson(request, response) {

    let name = request.query.personname;
    let url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${name}`;

    axios.get(url).then((result) => {

        let person = result.data.results.map((theresult) => {

            return new Person(theresult.id, theresult.name, theresult.gender);

        })

        //let person = result.data.results;

        response.json(person);

    }).catch((error => {
        console.log(error);
        response.send("error in getting data from API search")
    }))


}


function Movies(title, poster_path, overview) {

    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}

function Person(id, name, gender) {

    this.id = id;
    this.name = name;
    this.gender = gender;
}


// these functions belowe from day 11 task

function homeHanldler(req, resp) {

    let move = new Movies(moveData.title, moveData.poster_path, moveData.overview);

    resp.send(move);
}



function favoriteHanldler(request, response) {

    response.send('Welcome to Favorite Page');

}


function handleError(error, req, res) {
    res.status(500).send(error)
}