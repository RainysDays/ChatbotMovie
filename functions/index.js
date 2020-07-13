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
const similarity = require('compute-cosine-similarity')

var without_genre1 = null
var without_genre2 = null
var without_genre3 = null
var without_genre1_id = null
var without_genre2_id = null
var without_genre3_id = null
var get_movie=null
var get_movie2=null
var get_movie_recom=null
var get_movie_id = null
var genre1 = null
var genre2 = null
var genre3 = null
var genre_id1 = null
var genre_id2 = null
var genre_id3 = null
var nama_user = null
var movconfirm = null
var movid = null
var tempmovTitle = null
var tempmovOverview = null
var tempmovID = null
var movie_title1 = null
var movie1 = null
var recom_mov1 = null
var movie_title2 = null
var movie2 = null
var recom_mov2 = null
var movie_title3 = null
var movie3 = null
var recom_mov3 = null
var movieres1 = null

var rand_recom_mov1 = null
var rand_recom_mov2 = null
var rand_recom_mov3 = null

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  // function RecommendChoiceHandler(agent){
  //   agent.add("Halo, saya bot yang bisa merekomendasikan film. Apakah kamu ingin saya rekomendasikan film berdasarkan yang kamu suka atau ingin saya berikan judul film secara random?")
  // }

  // async function RecommendChoiceLikedHandler(agent){
  //   var judul = agent.parameters.title
  //   const getid = new Promise((resolve,reject)=>{
  //     mdb.searchMovie({query:judul},(err,res)=>{
  //       let movid = res.results[0]['id']
  //       resolve(movid)
  //     })
  //   })

  //   movid = await getid
  //   // console.log(movid)
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id:movid},(err,res)=>{
  //       let movieres = res.results
  //       resolve(movieres)
  //     })
  //   })

  //   return getrecom.then((data)=>{
  //     agent.add('Karena kamu menonton film '+judul+' , berikut ini adalah rekomendasi film yang bisa kamu tonton selanjutnya: ')
  //     data.forEach(element=>{
  //       agent.add(element.title)
  //       agent.add('Sinopsis: '+element.overview)
  //     })
  //     agent.add('Apakah ada film lain yang kamu suka?')
  //   })
  // }

  // function RecommendChoiceLikedEndHandler(agent){
  //   agent.add('Sampai jumpa lagi. Kalau ada film yang ingin saya rekomendasikan bisa sapa saya lagi atau ketik /start')
  // }
  // function RecommendChoiceRandomHandler(agent){
  //   var num = Math.floor(Math.random()* 100)
  //   var res = Math.floor(Math.random()* 10)
  //   return themoviedb.discover.movie({page:num,vote_average_gte:num,with_original_language:'en'})
  //   .then((data)=>{
  //     let movieres = data.results[res]
  //     tempmovTitle = movieres['title']
  //     tempmovOverview = movieres['overview']
  //     tempmovID = movieres['id']
  //     agent.add('Pernahkah kamu melihat film '+tempmovTitle+'?')
  //   })
  // }

  // function RecommendChoiceRandomKnowHandler(agent){
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id:tempmovID},(err,res)=>{
  //       let movieres = res.results
  //       resolve(movieres)
  //     })
  //   })


  //   return getrecom.then((data)=>{
  //     agent.add('Karena kamu pernah melihat film '+tempmovTitle+' , berikut ini adalah rekomendasi film yang bisa kamu tonton: ')
  //     data.forEach(element=>{
  //       agent.add(element.title)
  //       agent.add('Sinopsis: '+element.overview)
  //     })
  //     agent.add('Apakah kamu mau direkomendasikan film lain?')
  //   })
  // }

  // function RecommendChoiceRandomNeverKnowHandler(agent){
  //   agent.add('Oh, Oke. Saya coba tampilkan sinopsis dari film '+tempmovTitle+' ya.')
  //   agent.add('Sinopsis: '+tempmovOverview)
  //   agent.add('Bagaimana? Apakah kamu tertarik dengan film tersebut?')
  // }

  // function RecommendChoiceRandomNeverKnowNoHandler(agent){
  //   agent.add('Baiklah. Apakah kamu mau saya rekomendasikan film lain?')
  // }

  // function RecommendChoiceRandomNeverKnowNoAnotherRandomHandler(agent){
  //   var num = Math.floor(Math.random()* 20)
  //   var res = Math.floor(Math.random()* 10)
  //   return themoviedb.discover.movie({page:num,vote_average_gte:num})
  //   .then((data)=>{
  //     let movieres = data.results[res]
  //     tempmovTitle = movieres['title']
  //     tempmovOverview = movieres['overview']
  //     tempmovID = movieres['id']
  //     agent.add('Apakah kamu tertarik dengan film '+tempmovTitle+'?')
  //   })
  // }

  // function RecommendChoiceRandomNeverKnowNoDontKnowHandler(agent){
  //   agent.add('Oh, Oke. Saya coba tampilkan sinopsis dari film '+tempmovTitle+' ya.')
  //   agent.add('Sinopsis: '+tempmovOverview)
  //   agent.add('Bagaimana? Apakah kamu tertarik dengan film tersebut?')
  // }

  // function RecommendChoiceRandomNeverKnowNoEndHandler(agent){
  //   agent.add('Sampai jumpa lagi. Kalau ada film yang ingin saya rekomendasikan bisa sapa saya lagi atau ketik /start')
  // }

  // function RecommendChoiceRandomNeverKnowNoInterestedHandler(agent){
  //   // console.log(tempmovID)
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id:tempmovID},(err,res)=>{
  //       let movieres = res.results
  //       resolve(movieres)
  //     })
  //   })


  //   return getrecom.then((data)=>{
  //     agent.add('Karena kamu tertarik dengan film '+tempmovTitle+' , berikut ini adalah rekomendasi film yang bisa kamu tonton: ')
  //     data.forEach(element=>{
  //       agent.add(element.title)
  //       agent.add('Sinopsis: '+element.overview)
  //     })
  //     agent.add('Apakah kamu mau direkomendasikan film lain?')
  //   })
  // }

  function welcomehandler(agent){
    agent.add('Halo, saya adalah bot rekomendasi film. saya bisa merekomendasikan film berdasarkan film yang kamu sukai. Apakah kamu ingin saya rekomendasikan film?')
  }

  function welcomeasknamehandler(agent){
    nama_user = agent.parameters.name
    agent.add('Kak '+nama_user+' ya. Apakah seterusnya kamu ingin saya panggil dengan nama '+nama_user+' ?')
  }

  function welcomeendhandler(agent){
    agent.add('Baiklah. Nanti kalau berubah pikiran bisa coba sapa saya lagi atau ketik /start ya. Terimakasih.')
  }

  function asknamewronghandler(agent){
    nama_user = agent.parameters.name
    agent.add('Oke. Kak '+nama_user+' ya. Apakah seterusnya kamu ingin saya panggil dengan nama '+nama_user+' ?')
  }

  function askmoviehandler(agent){
    agent.add('Baik kak '+nama_user+' , apakah kak '+nama_user+' punya judul film yang disukai? Kalau tidak juga tidak masalah, nanti akan saya berikan judul film random dimana kak '+nama_user+' bisa menentukan apakah suka dengan film yang saya berikan atau tidak.')
  }

  async function askmovierememberhandler(agent){
    movie_title1 = agent.parameters.movie1
    const getmovie = new Promise((resolve,reject)=>{
      mdb.searchMovie({query:movie_title1},(err,res)=>{
        let movie = res.results[0]
        resolve(movie)
        // console.log(movie1)
      })
    })

    movie1 = await getmovie
    movie_id = movie1['id']

    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id: movie_id},(err,res)=>{
        let movieres = res.results
        resolve(movieres)
      })
    })

    recom_mov1 = await getrecom

    agent.add('Oke, film '+movie_title1+' ya. Apakah ada lagi?')
    // console.log(movie1['id'])
  }

  function askmoviedontrememberhandler(agent){
    agent.add('Oke tidak masalah. Kalau boleh tau apakah kamu ada pilihan genre yang kamu sukai?')
  }

  function askmoviedontrememberwithoutgenrehandler(agent){
    agent.add('Oke, saya tampilkan film secara random ya.')
    var num = Math.ceil(Math.random()* 10)+1
    var score = Math.ceil(Math.random()* 10)+1
    var pick = Math.ceil(Math.random()* 10)
    return themoviedb.discover.movie({page:num,vote_average_gte:score})
    .then((data)=>{
      get_movie = data.results[pick]
      get_movie_id = get_movie['id']
      agent.add('Judul: '+get_movie['title'])
      agent.add('Sinopsis: '+get_movie['overview'])
      agent.add('Score TMDB: '+get_movie['vote_average'])
      agent.add('Apakah kamu tertarik dengan film tersebut?')
    })
  }

  async function askmoviedontrememberwithoutgenreinterestedhandler(agent){
    agent.add('Karena kamu tertarik dengan film '+get_movie['title']+' maka film ini mungkin cocok untuk kamu tonton selanjutnya')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  async function askmoviedontrememberwithoutgenreinterestednohandler(agent){
    agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+get_movie['title']+' ya.')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  function askmoviedontrememberwithoutgenreinterestedyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  function askmoviedontrememberwithgenrehandler(agent){
    genre1 = agent.parameters.genre
    genre_id1 = genreid(genre1)
    agent.add('Genre '+genre1+' ya. Apakah ada tambahan genre lain?')
    // console.log(genre_id1)
  }

  function askmoviedontrememberwithgenrenohandler(agent){
    agent.add('Oke, saya tampilkan film dengan genre '+genre1+' ya.')
    var num = Math.ceil(Math.random()* 10)+1
    var score = Math.ceil(Math.random()* 10)+1
    var pick = Math.ceil(Math.random()* 10)
    return themoviedb.discover.movie({page:num,vote_average_gte:score,with_genres:genre_id1})
    .then((data)=>{
      get_movie = data.results[pick]
      get_movie_id = get_movie['id']
      agent.add('Judul: '+get_movie['title'])
      agent.add('Sinopsis: '+get_movie['overview'])
      agent.add('Score TMDB: '+get_movie['vote_average'])
      agent.add('Apakah kamu tertarik dengan film tersebut?')
    })
  }

  async function askmoviedontrememberwithgenreinterestedhandler(agent){
    agent.add('Karena kamu tertarik dengan film '+get_movie['title']+' maka film ini mungkin cocok untuk kamu tonton selanjutnya')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  async function askmoviedontrememberwithgenreinterestednohandler(agent){
    agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+get_movie['title']+' ya.')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  function askmoviedontrememberwithgenreinterestedyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  function askmoviedontrememberwithsecondgenrehandler(agent){
    genre2 = agent.parameters.genre
    genre_id2 = genreid(genre2)
    agent.add('Genre '+genre1+' dan '+genre2+' ya. Kamu masih bisa menambahkan 1 genre lagi. Apakah kamu ada genre lain yang kamu sukai?')
  }

  function askmoviedontrememberwithsecondgenrenohandler(agent){
    agent.add('Oke, saya tampilkan film dengan genre '+genre1+' dan '+genre2+' ya.')
    var num = Math.ceil(Math.random()* 10)+1
    var score = Math.ceil(Math.random()* 10)+1
    var pick = Math.ceil(Math.random()* 10)
    return themoviedb.discover.movie({page:num,vote_average_gte:score,with_genres:genre_id1,genre_id2})
    .then((data)=>{
      get_movie = data.results[pick]
      get_movie_id = get_movie['id']
      agent.add('Judul: '+get_movie['title'])
      agent.add('Sinopsis: '+get_movie['overview'])
      agent.add('Score TMDB: '+get_movie['vote_average'])
      agent.add('Apakah kamu tertarik dengan film tersebut?')
    })
  }

  async function askmoviedontrememberwithsecondgenreinterestedhandler(agent){
    agent.add('Karena kamu tertarik dengan film '+get_movie['title']+' maka film ini mungkin cocok untuk kamu tonton selanjutnya')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  async function askmoviedontrememberwithsecondgenreinterestednohandler(agent){
    agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+get_movie['title']+' ya.')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton?')
  }

  function askmoviedontrememberwithsecondgenreinterestedyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  function askmoviedontrememberwiththirdgenrehandler(agent){
    genre3 = agent.parameters.genre
    genre_id3 = genreid(genre3)
    agent.add('Oke, film dengan genre '+genre1+', '+genre2+' dan '+genre3+' ya.')
    var num = Math.ceil(Math.random()* 10)+1
    var score = Math.ceil(Math.random()* 10)+1
    var pick = Math.ceil(Math.random()* 10)
    return themoviedb.discover.movie({page:num,vote_average_gte:score,with_genres:genre_id1,genre_id2,genre_id3})
    .then((data)=>{
      get_movie = data.results[pick]
      get_movie_id = get_movie['id']
      agent.add('Judul: '+get_movie['title'])
      agent.add('Sinopsis: '+get_movie['overview'])
      agent.add('Score TMDB: '+get_movie['vote_average'])
      agent.add('Apakah kamu tertarik dengan film tersebut?')
    })
  }
  
  function askmoviedontrememberwiththirdgenrenohandler(agent){
    agent.add('Oke. Saya tampilkan film lain dengan genre '+genre1+', '+genre2+' dan '+genre3+' ya.')
    var num = Math.ceil(Math.random()* 10)+1
    var score = Math.ceil(Math.random()* 10)+1
    var pick = Math.ceil(Math.random()* 10)
    return themoviedb.discover.movie({page:num,vote_average_gte:score,with_genres:genre_id1,genre_id2,genre_id3})
    .then((data)=>{
      get_movie = data.results[pick]
      get_movie_id = get_movie['id']
      agent.add('Judul: '+get_movie['title'])
      agent.add('Sinopsis: '+get_movie['overview'])
      agent.add('Score TMDB: '+get_movie['vote_average'])
      agent.add('Apakah kamu tertarik dengan film tersebut?')
    })
  }

  async function askmoviedontrememberwiththirdgenreyeshandler(agent){
    agent.add('Karena kamu tertarik dengan film '+get_movie['title']+' maka film ini mungkin cocok untuk kamu tonton selanjutnya')
    var num = Math.ceil(Math.random()* 2)+1
    var pick = Math.ceil(Math.random()* 10)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:get_movie_id,page:1},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    get_movie2 = await getrecom
    agent.add('Judul: '+get_movie2['title'])
    agent.add('Sinopsis: '+get_movie2['overview'])
    agent.add('Score TMDB: '+get_movie2['vote_average'])
    agent.add('Dari rekomendasi diatas apakah film tersebut cocok untuk kamu tonton?')
  }

  function askmoviedontrememberwiththirdgenreaccepthandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  // async function moviedontrememberthirdgenrenohandler(agent){
  //   agent.add('Oke. Saya tampilkan film lain yang memiliki genre '+genre1+', '+genre2+' dan '+genre3+' ya.')
  //   var num = Math.ceil(Math.random()* 10)+1
  //   var score = Math.ceil(Math.random()* 10)+1
  //   var pick = Math.ceil(Math.random()* 10)
  //   return themoviedb.discover.movie({page:num,vote_average_gte:score,with_genres:genre_id1,genre_id2,genre_id3})
  //   .then((data)=>{
  //     get_movie = data.results[pick]
  //     get_movie_id = get_movie['id']
  //     agent.add('Judul: '+get_movie['title'])
  //     agent.add('Sinopsis: '+get_movie['overview'])
  //     agent.add('Score TMDB: '+get_movie['vote_average'])
  //     agent.add('Apakah kamu tertarik dengan film tersebut?')
  //   })
  // }

  // async function moviedontrememberthirdgenreinterestedhandler(agent){
  //   agent.add('Karena kamu tertarik dengan film '+get_movie['title']+' maka film ini mungkin cocok untuk kamu tonton selanjutnya')
  //   var i=0
  //   var num = Math.ceil(Math.random()* 10)+1
  //   var pick = Math.ceil(Math.random()* 10)
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id:get_movie_id,page:num},(err,res)=>{
  //       let movieres = res.results[pick]
  //       resolve(movieres)
  //       console.log(movieres)
  //     })
  //   })
  //   get_movie2 = await getrecom
  //   for(i;i<3;i++){
  //     agent.add('Judul: '+get_movie2[i]['title'])
  //     agent.add('Sinopsis: '+get_movie2[i]['overview'])
  //     agent.add('Score TMDB: '+get_movie2[i]['vote_average'])
  //   }
  //   agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton?')
  // }

  // function moviedontrememberthirdgenreinterestedyeshandler(agent){
  //   agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  // }

  // async function moviedontrememberthirdgenreinterestednohandler(agent){
  //   agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+get_movie['title']+' ya.')
  //   var num = Math.ceil(Math.random()* 2)+1
  //   var pick = Math.ceil(Math.random()* 10)
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id:get_movie_id,page:num},(err,res)=>{
  //       let movieres = res.results[pick]
  //       resolve(movieres)
  //       // console.log(movieres)
  //     })
  //   })
  //   get_movie_recom = await getrecom
  //   agent.add('Judul: '+get_movie_recom['title'])
  //   agent.add('Sinopsis: '+get_movie_recom['overview'])
  //   agent.add('Score TMDB: '+get_movie_recom['vote_average'])
  //   agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton?')
  // }

  function getonerecommendationhandler(agent){
    agent.add('Oke. Karena kamu suka film '+movie_title1+', berikut ini adalah beberapa rekomendasi film yang bisa kamu tonton selanjutnya :')
    var i=0
    for(i;i<3;i++){
      agent.add('Judul: '+recom_mov1[i]['title'])
      agent.add('Sinopsis: '+recom_mov1[i]['overview'])
      agent.add('Score TMDB: '+recom_mov1[i]['vote_average'])
      // console.log(genreid(recom_mov1[i]['genre_ids']))
    }
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton selanjutnya?')
  }

  // async function getoneanotherrecommendationhandler(agent){
  //   movie_title1 = agent.parameters.movie1
  //   const getmovie = new Promise((resolve,reject)=>{
  //     mdb.searchMovie({query:movie_title1},(err,res)=>{
  //       let movie = res.results[0]
  //       resolve(movie)
  //       // console.log(movie1)
  //     })
  //   })
  //   movie1 = await getmovie
  //   movie_id = movie1['id']
  //   const getrecom = new Promise((resolve,reject)=>{
  //     mdb.movieRecommend({id: movie_id},(err,res)=>{
  //       let movieres = res.results
  //       resolve(movieres)
  //     })
  //   })
  //   recom_mov1 = await getrecom
  //   agent.add('Oke. Karena kamu suka film '+movie_title1+', berikut ini adalah beberapa rekomendasi film yang bisa kamu tonton selanjutnya :')
  //   var i=0
  //   for(i;i<5;i++){
  //     agent.add('Judul: '+recom_mov1[i]['title'])
  //     agent.add('Sinopsis: '+recom_mov1[i]['overview'])
  //     agent.add('Score TMDB: '+recom_mov1[i]['vote_average'])
  //     console.log(genreid(recom_mov1[i]['genre_ids']))
  //   }
  //   console.log('Apakah kamu ingin direkomendasikan film lain?')
  // }

  function getonerecommendationyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  function getonerecommendationnohandler(agent){
    agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+movie_title1+' ya.')
    var i=3
    for(i;i<7;i++){
      agent.add('Judul: '+recom_mov1[i]['title'])
      agent.add('Sinopsis: '+recom_mov1[i]['overview'])
      agent.add('Score TMDB: '+recom_mov1[i]['vote_average'])
    }
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton selanjutnya?')
  }

  function acceptonerecommendationhandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  async function throwrandomonerecommendationhandler(agent){
    var num_page = Math.ceil(Math.random()* 2)
    var pick = Math.ceil(Math.random()* 9)
    movie_id = movie1['id']
    // console.log(num_page)
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })
    rand_recom_mov1 = await getrecom
    agent.add('Oke. Bagaimana dengan film ini? Apakah menurutmu film ini cocok untuk kamu tonton selanjutnya?')
    // console.log(rand_recom_mov1)
    agent.add('Judul: '+rand_recom_mov1['title'])
    agent.add('Sinopsis: '+rand_recom_mov1['overview'])
    agent.add('Score TMDB: '+rand_recom_mov1['vote_average'])
  }

  function throwrandomonerecommendationyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  async function askmovieremembersecondhandler(agent){
    movie_title2 = agent.parameters.movie1
    const getmovie = new Promise((resolve,reject)=>{
      mdb.searchMovie({query: movie_title2},(err,res)=>{
        let movie = res.results[0]
        resolve(movie)
      })
    })

    movie2 = await getmovie
    movie_id = movie2['id']

    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id},(err,res)=>{
        let movieres = res.results
        resolve(movieres)
      })
    })

    recom_mov2 = await getrecom

    agent.add('Oke, film '+movie_title1+' dan '+movie_title2+' ya. Kamu masih bisa menambahkan film 1 lagi. Apakah ada lagi?')

  }

  function gettworecommendationhandler(agent){
    agent.add('Oke. Karena kamu suka film '+movie_title1+' dan '+movie_title2+', berikut ini adalah beberapa rekomendasi yang bisa kamu tonton selanjutnya: ')
    var i=0
    var j=0
    for(i;i<3;i++){
      for(j;j<3;j++){
        agent.add('Judul: '+recom_mov1[j]['title'])
        agent.add('Sinopsis: '+recom_mov1[j]['overview'])
        agent.add('Score TMDB: '+recom_mov1[j]['vote_average'])
      }
      agent.add('Judul: '+recom_mov2[i]['title'])
      agent.add('Sinopsis: '+recom_mov2[i]['overview'])
      agent.add('Score TMDB: '+recom_mov2[i]['vote_average'])
    }
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton selanjutnya?')
  }

  function gettworecommendationyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  function gettworecommendationnohandler(agent){
    agent.add('Oke. Saya tampilkan rekomendasi lain untuk film '+movie_title1+' dan '+movie_title2+' ya.')
    var i=3
    var j=3
    for(i;i<7;i++){
      for(j;j<7;j++){
        agent.add('Judul: '+recom_mov1[j]['title'])
        agent.add('Sinopsis: '+recom_mov1[j]['overview'])
        agent.add('Score TMDB: '+recom_mov1[j]['vote_average'])
      }
      agent.add('Judul: '+recom_mov2[i]['title'])
      agent.add('Sinopsis: '+recom_mov2[i]['overview'])
      agent.add('Score TMDB: '+recom_mov2[i]['vote_average'])
    }
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton selanjutnya?')
  }

  function accepttworecommendationhandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  async function throwtworandomrecommendationhandler(agent){
    var num_page = Math.ceil(Math.random()* 2)
    var pick = Math.ceil(Math.random()* 9)

    movie_id1 = movie1['id']
    movie_id2 = movie2['id']
    
    const getrecom1 = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id1,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })

    const getrecom2 = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id2,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })

    rand_recom_mov1=await getrecom1
    rand_recom_mov2=await getrecom2

    agent.add('Oke. Kalau begitu bagaimana dengan film ini? Apakah menurutmu film ini cocok untuk kamu tonton selanjutnya?')

    agent.add('Judul: '+rand_recom_mov1['title'])
    agent.add('Sinopsis: '+rand_recom_mov1['overview'])
    agent.add('Score TMDB: '+rand_recom_mov1['vote_average'])
    
    agent.add('Judul: '+rand_recom_mov2['title'])
    agent.add('Sinopsis: '+rand_recom_mov2['overview'])
    agent.add('Score TMDB: '+rand_recom_mov2['vote_average'])

  }

  function throwtworandomrecommendationyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  async function askmovierememberthirdhandler(agent){
    movie_title3 = agent.parameters.movie1
    const getmovie = new Promise((resolve,reject)=>{
      mdb.searchMovie({query: movie_title3},(err,res)=>{
        let movie = res.results[0]
        resolve(movie)
      })
    })
    movie3 = await getmovie
    movie_id = movie3['id']
    const getrecom = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id},(err,res)=>{
        let movieres = res.results
        resolve(movieres)
      })
    })
    recom_mov3 = await getrecom
    agent.add('Oke. Karena kamu suka film '+movie_title1+', '+movie_title2+' dan '+movie_title3+' maka berikut ini adalah beberapa rekomendasi film yang bisa kamu tonton selanjutnya: ')
    var i=0
    var j=0
    var k=0
    for(i;i<3;i++){
      for(j;j<3;j++){
        for(k;k<3;k++){
          agent.add('Judul: '+recom_mov1[k]['title'])
          agent.add('Sinopsis: '+recom_mov1[k]['overview'])
          agent.add('Score TMDB: '+recom_mov1[k]['vote_average'])
        }
        agent.add('Judul: '+recom_mov2[j]['title'])
        agent.add('Sinopsis: '+recom_mov2[j]['overview'])
        agent.add('Score TMDB: '+recom_mov2[j]['vote_average'])
      }
      agent.add('Judul: '+recom_mov3[i]['title'])
      agent.add('Sinopsis: '+recom_mov3[i]['overview'])
      agent.add('Score TMDB: '+recom_mov3[i]['vote_average'])
    }
    agent.add('Dari rekomendasi diatas apakah kamu menemukan film yang cocok untuk kamu tonton selanjutnya?')
  }

  function askmovierememberthirdyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  async function throwthreerandomrecommendationhandler(agent){
    var num_page = Math.ceil(Math.random()* 2)
    var pick = Math.ceil(Math.random()* 9)

    movie_id1 = movie1['id']
    movie_id2 = movie2['id']
    movie_id3 = movie3['id']
    
    const getrecom1 = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id1,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })

    const getrecom2 = new Promise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id2,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
        // console.log(movieres)
      })
    })

    const getrecom3 = newPromise((resolve,reject)=>{
      mdb.movieRecommend({id:movie_id3,page:num_page},(err,res)=>{
        let movieres = res.results[pick]
        resolve(movieres)
      })
    })

    rand_recom_mov1=await getrecom1
    rand_recom_mov2=await getrecom2
    rand_recom_mov3=await getrecom3

    agent.add('Oke. Bagaimana dengan film ini? Apakah menurutmu film ini cocok untuk kamu tonton selanjutnya?')

    agent.add('Judul: '+rand_recom_mov1['title'])
    agent.add('Sinopsis: '+rand_recom_mov1['overview'])
    agent.add('Score TMDB: '+rand_recom_mov1['vote_average'])
    
    agent.add('Judul: '+rand_recom_mov2['title'])
    agent.add('Sinopsis: '+rand_recom_mov2['overview'])
    agent.add('Score TMDB: '+rand_recom_mov2['vote_average'])

    agent.add('Judul: '+rand_recom_mov3['title'])
    agent.add('Sinopsis: '+rand_recom_mov3['overview'])
    agent.add('Score TMDB: '+rand_recom_mov3['vote_average'])
  }

  function throwthreerandomrecommendationyeshandler(agent){
    agent.add('Selamat kamu sudah menemukan film yang cocok untuk kamu tonton selanjutnya!')
  }

  // function moviedontrememberhandler(agent){

  // }

  function fallbackhandler(agent){
    agent.add("Maaf, bisa diulang?")
  }

  let intentMap = new Map()
  // intentMap.set('RecommendChoice', RecommendChoiceHandler)
  // intentMap.set('RecommendChoiceLiked', RecommendChoiceLikedHandler)
  // intentMap.set('RecommendChoiceLiked-End', RecommendChoiceLikedEndHandler)
  // intentMap.set('RecommendChoiceRandom', RecommendChoiceRandomHandler)
  // intentMap.set('RecommendChoiceRandomKnow', RecommendChoiceRandomKnowHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow', RecommendChoiceRandomNeverKnowHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow-No', RecommendChoiceRandomNeverKnowNoHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow-No-AnotherRandom', RecommendChoiceRandomNeverKnowNoAnotherRandomHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow-No-DontKnow', RecommendChoiceRandomNeverKnowNoDontKnowHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow-No-End', RecommendChoiceRandomNeverKnowNoEndHandler)
  // intentMap.set('RecommendChoiceRandomNeverKnow-No-Interested', RecommendChoiceRandomNeverKnowNoInterestedHandler)
  intentMap.set('Welcome', welcomehandler)
  intentMap.set('Welcome-ask-name', welcomeasknamehandler)
  intentMap.set('Welcome-end', welcomeendhandler)
  intentMap.set('Welcome-ask-name-wrong', asknamewronghandler)
  intentMap.set('ask-movie', askmoviehandler)
  intentMap.set('ask-movie-remember', askmovierememberhandler)
  intentMap.set('ask-movie-dont-remember', askmoviedontrememberhandler)
  intentMap.set('ask-movie-dont-remember-without-genre-interested', askmoviedontrememberwithoutgenreinterestedhandler)
  intentMap.set('ask-movie-dont-remember-without-genre-interested-yes', askmoviedontrememberwithoutgenreinterestedyeshandler)
  intentMap.set('ask-movie-dont-remember-without-genre-interested-no', askmoviedontrememberwithoutgenreinterestednohandler)
  intentMap.set('ask-movie-dont-remember-with-genre', askmoviedontrememberwithgenrehandler)
  intentMap.set('ask-movie-dont-remember-without-genre', askmoviedontrememberwithoutgenrehandler)
  intentMap.set('ask-movie-dont-remember-with-genre-no', askmoviedontrememberwithgenrenohandler)
  intentMap.set('ask-movie-dont-remember-with-genre-interested', askmoviedontrememberwithgenreinterestedhandler)
  intentMap.set('ask-movie-dont-remember-with-genre-interested-yes', askmoviedontrememberwithgenreinterestedyeshandler)
  intentMap.set('ask-movie-dont-remember-with-genre-interested-no', askmoviedontrememberwithgenreinterestednohandler)
  intentMap.set('ask-movie-dont-remember-with-second-genre', askmoviedontrememberwithsecondgenrehandler)
  intentMap.set('ask-movie-dont-remember-with-second-genre-no', askmoviedontrememberwithsecondgenrenohandler)
  intentMap.set('ask-movie-dont-remember-with-second-genre-interested', askmoviedontrememberwithsecondgenreinterestedhandler)
  intentMap.set('ask-movie-dont-remember-with-second-genre-interested-no', askmoviedontrememberwithsecondgenreinterestednohandler)
  intentMap.set('ask-movie-dont-remember-with-second-genre-interested-yes', askmoviedontrememberwithsecondgenreinterestedyeshandler)
  intentMap.set('ask-movie-dont-remember-with-third-genre', askmoviedontrememberwiththirdgenrehandler)
  // intentMap.set('movie-dont-remember-third-genre-no', moviedontrememberthirdgenrenohandler)
  // intentMap.set('movie-dont-remember-third-genre-interested', moviedontrememberthirdgenreinterestedhandler)
  // intentMap.set('movie-dont-remember-third-genre-interested-yes', moviedontrememberthirdgenreinterestedyeshandler)
  // intentMap.set('movie-dont-remember-third-genre-interested-no', moviedontrememberthirdgenreinterestednohandler)
  intentMap.set('ask-movie-dont-remember-with-third-genre-no', askmoviedontrememberwiththirdgenrenohandler)
  intentMap.set('ask-movie-dont-remember-with-third-genre-yes', askmoviedontrememberwiththirdgenreyeshandler)
  intentMap.set('ask-movie-dont-remember-with-third-genre-accept', askmoviedontrememberwiththirdgenreaccepthandler)
  intentMap.set('get-one-recommendation', getonerecommendationhandler)
  // intentMap.set('get-one-another-recommendation', getoneanotherrecommendationhandler)
  intentMap.set('get-one-recommendation-yes', getonerecommendationyeshandler)
  intentMap.set('get-one-recommendation-no', getonerecommendationnohandler)
  intentMap.set('accept-one-recommendation', acceptonerecommendationhandler)
  intentMap.set('throw-random-one-recommendation', throwrandomonerecommendationhandler)
  intentMap.set('throw-random-one-recommendation-yes', throwrandomonerecommendationyeshandler)
  intentMap.set('ask-movie-remember-second', askmovieremembersecondhandler)
  intentMap.set('get-two-recommendation', gettworecommendationhandler)
  intentMap.set('get-two-recommendation-yes', gettworecommendationyeshandler)
  intentMap.set('get-two-recommendation-no', gettworecommendationnohandler)
  intentMap.set('accept-two-recommendation', accepttworecommendationhandler)
  intentMap.set('throw-two-random-recommendation', throwtworandomrecommendationhandler)
  intentMap.set('throw-two-random-recommendation-yes', throwtworandomrecommendationyeshandler)
  intentMap.set('ask-movie-remember-third', askmovierememberthirdhandler)
  intentMap.set('ask-movie-remember-third-yes', askmovierememberthirdyeshandler)
  intentMap.set('throw-three-random-recommendation', throwthreerandomrecommendationhandler)
  intentMap.set('throw-three-random-recommendation-yes', throwthreerandomrecommendationyeshandler)
  // intentMap.set('movie-dont-remember', moviedontrememberhandler)
  intentMap.set('fallback', fallbackhandler)
  agent.handleRequest(intentMap)
})

module.exports=app