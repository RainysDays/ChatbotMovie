const express = require('express')
const timeout = require('await-timeout')
const { WebhookClient } = require('dialogflow-fulfillment')
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment')
const app = express()
const admin = require('firebase-admin')
const mdb = require('moviedb')('8c1065f3aa072f47d774980a51e0ad89')
const tmdb = require('tmdbv3').init('8c1065f3aa072f47d774980a51e0ad89')
const {v3,v4} = require('@leonardocabeza/the-movie-db')
const v3ApkiKey = '8c1065f3aa072f47d774980a51e0ad89'
const v4ApkiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzEwNjVmM2FhMDcyZjQ3ZDc3NDk4MGE1MWUwYWQ4OSIsInN1YiI6IjVlMmU2ZTgxNGNhNjc2MDAxMjQ4ZmFiNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZVqz6oeHWE6O4rpDE_HzfW3DSycFNl0QJRwF39aKKlk'
const themoviedb = v3(v3ApkiKey)
const themoviedb4 = v4(v4ApkiKey)
const axios = require('axios')
const lower = require('lower-case')
const genreid = require('./genreid')
const searchgenre = require('./searchgenre')
const searchmovid = require('./searchmovieid')
var movid = null
var movid2 = 1726

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function RecommendChoiceHandler(agent){
    agent.add("Halo mau direkomendasikan film berdasarkan genre atau judul film yang pernah kamu tonton?")
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
    var rate = agent.parameters.rate
    agent.add('Oke, pilihan genre kamu '+genreInput+' tahun '+tahun+' dan rating '+rate+'. Ada genre yang mau ditambahkan lagi?')
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
    var rate = agent.getContext('recommendchoicegetgenre-followup').parameters.rate
    agent.add('Ini list film dengan genre '+genreInput1+' dan '+genreInput2+' rilisan tahun '+tahun+' dengan rating '+rate+' :')
    return themoviedb.discover.movie({'with_genres':moviegenreid1,moviegenreid2,'primary_release_year':tahun,'vote_average.gte':rate,'sort_by':'popularity.desc'}).then((data)=>{
      let movieres = data.results
      movieres.forEach(element=>{
        agent.add(element.title)
        agent.add('sinopsis : '+element.overview)
      })
    })
  }

  function RecommendChoiceGetGenreNoHandler(agent){
    var genreInput = agent.getContext('recommendchoicegetgenre-followup').parameters.genre
    var genreLower = genreInput.toLowerCase()
    var moviegenreid = genreid(genreLower)
    var tahun = agent.getContext('recommendchoicegetgenre-followup').parameters.tahun
    var rate = agent.getContext('recommendchoicegetgenre-followup').parameters.rate
    agent.add('Ini list film dengan genre '+genreInput+' rilisan tahun '+tahun+' dan rating '+rate+' :')
    return themoviedb.discover.movie({'with_genres':moviegenreid,'primary_release_year':tahun,'vote_average.gte':rate,'sort_by':'popularity.desc'}).then((data)=>{
      let movieres = data.results
      movieres.forEach(element=>{
        agent.add(element.title)
        agent.add('sinopsis: '+element.overview)
      })
    })
  }

  async function RecommendChoiceTitleMovieHandler(agent){
    var judul = agent.parameters.title
    const test = new Promise((resolve,reject)=>{
      mdb.searchMovie({query:judul},(err,res)=>{
        let movieid = res.results[0]['id']
        resolve(movieid)
      })
    })

    const getTitle = new Promise((resolve,reject)=>{
      mdb.searchMovie({query:judul},(err,res)=>{
        let title = res.results[0]['title']
        resolve(title)
      })
    })

    title = await getTitle
    movid = await test

    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id: movid},(err,res)=>{
        let movieres = res.results
        resolve(movieres)
      })
    })
    
    return getrecom.then((data)=>{
      agent.add('Karena kamu pernah melihat film '+title+' , berikut ini rekomendasi film yang bisa kamu tonton selanjutnya: ')
      data.forEach(element => {
        // console.log(element.title)
        agent.add(element.title)
      });
    })
  }
  
  function fallbackdefaulthandler(agent){
    agent.add("Maaf, bisa diulang?")
  }

  let intentMap = new Map()
  intentMap.set('RecommendChoice', RecommendChoiceHandler)
  intentMap.set('RecommendChoiceAskGenre', RecommendAskGenreHandler)
  intentMap.set('RecommendChoiceGetGenre', RecommendGetGenreHandler)
  intentMap.set('RecommendChoiceTitleMovie', RecommendChoiceTitleMovieHandler)
  intentMap.set('RecommendChoiceFallback', RecommendChoiceFallbackHandler)
  intentMap.set('RecommendChoiceGetGenreYes', RecommendChoiceGetGenreYesHandler)
  intentMap.set('RecommendChoiceGetGenreNo', RecommendChoiceGetGenreNoHandler)
  intentMap.set('Fallback Intent', fallbackdefaulthandler)
  agent.handleRequest(intentMap)
})

module.exports=app