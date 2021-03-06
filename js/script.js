$(document).ready(function() {
  // 9e3b41d15d625e280b597413a544c557
  // https://api.themoviedb.org/3/movie/550?api_key=9e3b41d15d625e280b597413a544c557

  // // Creo evento al click del button
  // $('#search').click(function() {
  //   // Dichiaro in una variabile il valore dell'input
  //   var valueQuery = $('input').val();
  //
  //   // Resetto inizialmente il contenitore delle schede film che
  //   // andrò a popolare
  //   reset('.movie-container');
  //   reset('.error');
  //
  //   searchMovies(valueQuery);
  //   searchSeries(valueQuery);
  // });

  $('input').keypress(function(event) {
    if(event.which === 13 || event.keyCode === 13) {
      // Dichiaro in una variabile il valore dell'input
      var valueQuery = $('input').val();

      // Resetto inizialmente il contenitore delle schede film che
      // andrò a popolare
      reset('.movie-container');
      reset('.error');

      searchMoviesAndSeries(valueQuery, 'movie');
      searchMoviesAndSeries(valueQuery, 'tv');
    }
  });
});

// FUNCTIONS
// Funzione che resetta
function reset(selettore) {
  $(selettore).html('');
}

/// Funzione di chiamata ajax per ricerca
// e stampa di una lista di film e serie tv tramite ulteriore funzione
// Argomento:
//     --> valore di ricerca(una stringa), che andrà inserito nell'API
function searchMoviesAndSeries(valueQuery, type) {
  // Faccio la chiamata ajax all'API,
  // e inserisco il valore dell'input come query di ricerca
  var url = 'https://api.themoviedb.org/3/search/' + type;
  var api_key = '9e3b41d15d625e280b597413a544c557';

  $.ajax(
    {
      url: url,
      method: 'GET',
      data: {
        api_key: api_key,
        query: valueQuery,
        language: 'it-IT'
      },
      success: function(dataResponse) {
        var arrayMovies = dataResponse.results;
        if(arrayMovies.length === 0) {

          if(type == 'movie') {
            var zeroRisultsMessagge = 'La ricerca di Film non ha prodotto risultati.';
            printErrorMessage(zeroRisultsMessagge);
          } else {
            var zeroRisultsMessagge = 'La ricerca di Serie Tv non ha prodotto risultati.';
            printErrorMessage(zeroRisultsMessagge);
          }

        } else {
          printMoviesAndSeries(arrayMovies, type, api_key);
        }

      },
      error: function(richiesta, stato, errori) {
        var errorMessage;

        if(richiesta.status === 422) {
          errorMessage = 'Inserisci una chiave di ricerca.';
          printErrorMessage(errorMessage);
        } else {
          errorMessage = 'Ops, qualcosa è andato storto: error ' + richiesta.status;
          printErrorMessage(errorMessage);
        }
      }
    }
  );
}

// Funzione che tilizza handlbars per stampare
// singoli parti di oggetti di un array
// Argomento:
//     --> array di oggetti
function printMoviesAndSeries(array, type, api_key) {

  // Con handlebars copio il template della scheda film
  var source = $('#movie-template').html();
  var template = Handlebars.compile(source);

  // Creo un ciclo for per leggere tutti gli oggetti
  // nell'arrayMovies
  for (var i = 0; i < array.length; i++) {
    var vote = array[i].vote_average;
    var voteFinal = getVoteOneToFive(vote);

    var stars = getStars(voteFinal);
    var languageFlag = getFlagLang(array[i].original_language);
    var poster = getThePoster(array[i].poster_path);

    // Completo il template con un oggetto contente le info utili,
    // racchiuse negli oggeti risultanti da API
    // Qui completo per le serie tv
    if(type == 'tv') {
      var title = array[i].name;
      var originalTitle = array[i].original_name;
    }
    // Qui completo per i film
    else {
      var title = array[i].title;
      var originalTitle = array[i].original_title;
    }

    var context = {
      title: title,
      original_title: originalTitle,
      language: languageFlag,
      vote: stars,
      poster: poster,
      overview: array[i].overview,
      id: array[i].id,
    };

    var html = template(context);

    // Appendo poi il template al container
    $('.movie-container').append(html);

    getGenreAndCast(type, api_key, array[i].id);
  }

  // Alla fine resetto il paceholder dell'input
  $('input').val('');
}

// Funzione che cerca e aggiunge i generi e gli attori dei film/serie stampati
//
function getGenreAndCast(type, api_key, id) {

  // Faccio una chiamata ajax
  var url = 'https://api.themoviedb.org/3/' + type + '/' + id;

  $.ajax(
    {
      url: url,
      method: 'GET',
      data: {
        api_key: api_key,
        append_to_response: 'credits',
      },
      success: function(responseData) {
        var arrayGenre = responseData.genres;
        var cast = responseData.credits;
        var arrayCast = cast.cast;

        printGenreAndCast(arrayGenre, arrayCast, id);
      },
      error: function() {
        // ALERT di errore
      }
    }
  );

};

function printGenreAndCast(arrayGenre, arrayCast, id) {
  // Con handlebars copio il template della scheda film
  var source = $('#genre-cast-template').html();
  var template = Handlebars.compile(source);

  var arrayCastFinale = [];
  var arrayGenreFinale = [];

  for (var i = 0; i < 5; i++) {
    arrayCastFinale.push(arrayCast[i].name);
  }

  for (var i = 0; i < arrayGenre.length; i++) {
    arrayGenreFinale.push(arrayGenre[i].name)
  }

  var context = {
    genre: arrayGenreFinale,
    cast: arrayCastFinale,
  }

  var html = template(context);
  // Appendo poi il template al container
  $('.movie-info[data-id="' + id + '"]').append(html);

}


// Funzione che stampa a schermo, utilizzando
// handlebars, un messaggio di errore passatogli come Argomento
// Argomento:
//     --> stringa
function printErrorMessage(message) {
  reset('.error');

  var source = $('#error-message-template').html();
  var template = Handlebars.compile(source);

  var context = {
    message: message
  };
  var html = template(context);
  $('.error').append(html);
};

// Funzione che trasforma numeri decimali da 1 a 10
// in un numeri interi da 1 a 5
// Argomento:
//     --> numero
// return: numero diviso e arrotondato per eccesso
function getVoteOneToFive(number) {
  var voteInteger = number / 2;
  var voteFinal = voteInteger.toFixed();

  return voteFinal;
};

// Funzione che crea un array e lo riempie di un
// numero preciso(number) di stelle piene, e poi
// Ne aggiunge altre vuote, fino ad arrivare a 5 stelle totali(icone)
// Argomento:
//     --> numero, che indica quante stelle piene vuoi stampare
// return: array di icone
function getStars(number) {
  var arrayStars = [];
  for (var i = 0; i < number; i++) {
    var fullStar = '<i class="fas fa-star"></i>';

    arrayStars.push(fullStar);
  }

  while (arrayStars.length < 5) {
    var emptyStar = '<i class="far fa-star"></i>';
    arrayStars.push(emptyStar);
  }

  return arrayStars.join('');
};

// Funzione che ha un array di sigle che rappresentano
// le lingue, e poi controlla se il codice passato con l'argomento,
// è uguale a una delle sigle nell'array
// Argomento:
//     --> stringa, che indica il codice della lingua
// return: languageFlag, che corrisponde a una stringa di html da appendere
function getFlagLang(language) {
  var arrayFlags = ['it', 'en', 'de', 'fr', 'es', 'us'];

  if(arrayFlags.includes(language)) {
    var languageFlag = '<img src="img/' + language +'.png" alt="Flag">';
  }
  // else if(arrayFlags.includes('en')) {
  //   var languageFlag = '<img src="img/en.png" alt="Flag"> <img src="img/us.png" alt="Flag">';
  // }
  else {
    var languageFlag = language;
  }

  return languageFlag;
};

// Funzione che torna la source da inserire nel tag img.
// Se il codice inserito è nullo, allora inserisco una immagine fissa
// Argomento:
//     --> stringa, che indica il codice dei poster
// return: posterHtml, che indica la source delle immagini da inserire
function getThePoster(poster) {
  if(poster === null) {
    var posterHtml = 'img/no-poster.jpg';
  } else {
    var posterHtml = 'https://image.tmdb.org/t/p/w342'+ poster;
  }

  return posterHtml;
};
