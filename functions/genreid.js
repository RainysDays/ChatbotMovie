const functions = require('firebase-functions')
const app = require('./index')

function moviegenreid (genre){
    var id = null
    if (genre == 'action'){
      id = 28
    }
    else if(genre == 'adventure'){
      id = 12
    }
    else if(genre == 'animation' || genre == 'animasi'){
      id = 16
    }
    else if(genre == 'comedy'){
      id = 35
    }
    else if(genre == 'crime'){
      id = 80
    }
    else if(genre == 'documentary' || genre == 'documenter' || genre == 'dokumenter'){
      id = 99
    }
    else if(genre == 'drama'){
      id = 18
    }
    else if(genre == 'family'){
      id = 10751
    }
    else if(genre == 'fantasy'){
      id = 14
    }
    else if(genre == 'history'){
      id = 36
    }
    else if(genre == 'horror'){
      id = 27
    }
    else if(genre == 'music'){
      id = 10402
    }
    else if(genre == 'mystery'){
      id = 9648
    }
    else if(genre == 'romance'){
      id = 10749
    }
    else if(genre == 'science fiction' || genre == 'sci-fi' || genre == 'scifi'){
      id = 878
    }
    else if(genre == 'tv movie'){
      id = 10770
    }
    else if(genre == 'thriller' || genre == 'thrill'){
      id = 53
    }
    else if(genre == 'war'){
      id = 10752
    }
    else if(genre == 'western'){
      id = 37
    }
    else{
      id = null
    }
    return id
  }

module.exports = moviegenreid