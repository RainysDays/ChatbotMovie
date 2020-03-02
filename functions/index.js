const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment')
const app = express()
const admin = require('firebase-admin')
const mdb = require('moviedb')('8c1065f3aa072f47d774980a51e0ad89')
const tmdb = require('tmdbv3').init('8c1065f3aa072f47d774980a51e0ad89')
const {v3,v4} = require('@leonardocabeza/the-movie-db')
const v3ApkiKey = '8c1065f3aa072f47d774980a51e0ad89'
const themoviedb = v3(v3ApkiKey)
const axios = require('axios')
const lower = require('lower-case')
const genreid = require('./genreid')
const searchgenre = require('./searchgenre')
var movieres = [] //global variable

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function RecommendChoiceHandler(agent){
    agent.add("Halo mau direkomendasikan film berdasarkan genre atau rating?")
  }

  function RecommendAskGenreHandler(agent){
    agent.add('Genre film apa yang ingin direkomendasikan?')
  }

  function RecommendChoiceFallbackHandler(agent){
    agent.add('Maaf, saat ini pilihan rekomendasi hanya berdasarkan genre dan rating film. Jadi mau direkomendasikan berdasarkan genre atau rating film?')
  }
  
  function RecommendGetGenreHandler(agent){
    var genreInput = agent.parameters.genre
    var tahun = agent.parameters.tahun
    agent.add('Oke, pilihan genre kamu '+genreInput+' dan film tahun '+tahun+'. Ada genre yang mau ditambahkan lagi?')
  }

  function RecommendChoiceGetGenreYesHandler(agent){

    //input1 from context
    var genreInput1 = agent.getContext('recommendchoicegetgenre-followup').parameters.genre
    var genreLower1 = genreInput1.toLowerCase()
    var moviegenreid1 = genreid(genreLower1)

    //input2 from action and parameters intent
    var genreInput2 = agent.parameters.genre2
    var genreLower2 = genreInput2.toLowerCase()
    var moviegenreid2 = genreid(genreLower2)
    var tahun = agent.getContext('recommendchoicegetgenre-followup').parameters.tahun
    agent.add('Ini list film dengan genre '+genreInput1+' dan '+genreInput2+' rilisan tahun '+tahun+' :')
    return themoviedb.discover.movie({with_genres:moviegenreid1,moviegenreid2,primary_release_year:tahun}).then((data)=>{
      let movieres = data.results
      movieres.forEach(element=>{
        agent.add(element.title)
      })
    })
  }

  function RecommendChoiceGetGenreNoHandler(agent){
    var genreInput = agent.getContext('recommendchoicegetgenre-followup').parameters.genre
    var genreLower = genreInput.toLowerCase()
    var moviegenreid = genreid(genreLower)
    var tahun = agent.getContext('recommendchoicegetgenre-followup').parameters.tahun
    agent.add('Ini list film dengan genre '+genreInput+' rilisan tahun '+tahun+' :')
    return themoviedb.discover.movie({with_genres:moviegenreid,primary_release_year:tahun}).then((data)=>{
      let movieres = data.results
      movieres.forEach(element=>{
        agent.add(element.title)
      })
    })
  }

  function RecommendTopRatedHandler(agent){
    return themoviedb.movie.topRated().then((data)=>{
      let movieres = data.results
      movieres.forEach(element=>{
        agent.add(element.title)
      })
    })
  }



  function fallbackdefaulthandler(agent){
    agent.add("Maaf, bisa diulang?")
  }

  let intentMap = new Map()
  intentMap.set('RecommendChoice', RecommendChoiceHandler)
  intentMap.set('RecommendChoiceAskGenre', RecommendAskGenreHandler)
  intentMap.set('RecommendChoiceGetGenre', RecommendGetGenreHandler)
  intentMap.set('RecommendChoiceTopRated', RecommendTopRatedHandler)
  intentMap.set('RecommendChoiceFallback', RecommendChoiceFallbackHandler)
  intentMap.set('RecommendChoiceGetGenreYes', RecommendChoiceGetGenreYesHandler)
  intentMap.set('RecommendChoiceGetGenreNo', RecommendChoiceGetGenreNoHandler)
  intentMap.set('Fallback Intent', fallbackdefaulthandler)
  agent.handleRequest(intentMap)
})

module.exports=app