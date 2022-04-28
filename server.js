'use strict';

const express = require('express');
const {get, send } = require('express/lib/response');
const cors = require('cors')
const app = express();
const port = 3000;
const moveData = require('./Movies-data/data.json');
const { default: axios } = require('axios');
require("dotenv").config();

let apiKey = "3368b429ebd3bb64615918d802e86b65";

app.use(cors());


app.listen(port, () => {
    console.log('we know listen to the app form port 3000');
})


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
