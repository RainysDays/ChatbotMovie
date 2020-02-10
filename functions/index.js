const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const {Card, Suggestion} = require('dialogflow-fulfillment')
const app = express()
const admin = require('firebase-admin')
const mdb = require('moviedb')('8c1065f3aa072f47d774980a51e0ad89')
const tmdb = require('tmdbv3').init('8c1065f3aa072f47d774980a51e0ad89')
const axios = require('axios')
const lower = require('lower-case')
const genreid = require('./searchgenreid')

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  
  function welcome (agent) {
    agent.add('Halo, ada yang bisa saya bantu?')
  }

  function fallback(agent){
    agent.add('Maaf, bisa diulang?')
  }

  function movie(agent){
    var genreInput = agent.parameters.genre
    var genreLower = genreInput.toLowerCase()
    var moviegenreid = genreid(genreLower)
    console.log(moviegenreid)
    // tmdb.genre.movies(moviegenreid,(err,res)=>{
    //   console.log(res)
    // })
    tmdb.movie.info(28,(err,res)=>{
      console.log(res.title)
    })
  }

  let intentMap = new Map()
  intentMap.set('Welcome Intent', welcome)
  intentMap.set('Fallback Intent', fallback)
  intentMap.set('MovieRecommendIntent', movie)
  agent.handleRequest(intentMap)
})

module.exports=app