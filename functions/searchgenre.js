const functions = require('firebase-functions')
const app = require('./index')
const tmdb = require('tmdbv3').init('8c1065f3aa072f47d774980a51e0ad89')
const {v3,v4} = require('@leonardocabeza/the-movie-db')
const v3ApkiKey = '8c1065f3aa072f47d774980a51e0ad89'
const themoviedb = v3(v3ApkiKey)

function searchgenre(arr,id,i){
    for(i; i<=5; i++){
        themoviedb.discover.movie({with_genres:id,page:i}).then((data)=>{
            console.log(data)
            return arr = data
        })
    }
}

module.exports = searchgenre