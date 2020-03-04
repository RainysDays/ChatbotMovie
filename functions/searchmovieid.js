const functions = require('firebase-functions')
const app = require('./index')
const {v3,v4} = require('@leonardocabeza/the-movie-db')
const v3ApkiKey = '8c1065f3aa072f47d774980a51e0ad89'
const themoviedb = v3(v3ApkiKey)

function searchmovieid(title){
    return themoviedb.search.movies({query:title}).then((data)=>{
        themoviedb.movie.recommendations({movieId: data.results[0]['id']}).then((dat)=>{
            console.log(dat)
        })
    })
}

module.exports = searchmovieid