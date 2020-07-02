// <i class="fas fa-star"></i> piena
// <i class="far fa-star"></i> vuota

$(document).ready(function() {
  // 9e3b41d15d625e280b597413a544c557
  // https://api.themoviedb.org/3/movie/550?api_key=9e3b41d15d625e280b597413a544c557

  // // Creo evento al click del button
  $('#search').click(function() {
    // Dichiaro in una variabile il valore dell'input
    var valueQuery = $('input').val();

    searchMovies(valueQuery);
    searchSeries(valueQuery);
  });

  $('input').keypress(function(event) {
    if(event.which === 13 || event.keyCode === 13) {
      // Dichiaro in una variabile il valore dell'input
      var valueQuery = $('input').val();

      searchMovies(valueQuery);
      searchSeries(valueQuery);
    }
  });
});

// FUNCTIONS
// Funzione di chiamata ajax e utilizzo di handlbars,
// per ricerca e stampa di una lista di film
// Argomento:
//     --> valore di ricerca(una stringa), che andrà inserito nell'API
function searchMovies(valueQuery) {
  // Faccio la chiamata ajax all'API,
  // e inserisco il valore dell'input come query di ricerca
  var url = 'https://api.themoviedb.org/3/search/movie';
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
          var zeroRisultsMessagge = 'La ricerca non ha prodotto risultati.';
          printErrorMessage(zeroRisultsMessagge);
        }

        printMoviesAndSeries(arrayMovies, url);
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

function searchSeries(valueQuery) {
  // Faccio la chiamata ajax all'API,
  // e inserisco il valore dell'input come query di ricerca
  var url = 'https://api.themoviedb.org/3/search/tv';
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
        var arraySeries = dataResponse.results;
        
        if(arrayMovies.length === 0) {
          var zeroRisultsMessagge = 'La ricerca non ha prodotto risultati.';
          printErrorMessage(zeroRisultsMessagge);
        }

        printMoviesAndSeries(arraySeries, url);
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

function printMoviesAndSeries(array, url) {
  // Resetto inizialmente il contenitore delle schede film che
  // andrò a popolare
  $('.movie-container').html('');

  // Con handlebars copio il template della scheda film
  var source = $('#movie-template').html();
  var template = Handlebars.compile(source);

  // Creo un ciclo for per leggere tutti gli oggetti
  // nell'arrayMovies
  for (var i = 0; i < array.length; i++) {
    var vote = array[i].vote_average;
    var voteFinal = getVoteOneToFive(vote);

    var stars = getStars(voteFinal);

    // Completo il template con un oggetto contente le info utili,
    // racchiuse negli oggeti risultanti da API
    if(url.includes('tv') ) {
      var context = {
        title: array[i].name,
        original_title: array[i].original_name,
        language: '<img src="img/' + array[i].original_language + '.png" alt="Flag">',
        vote: stars,
        poster: 'https://image.tmdb.org/t/p/w154'+ array[i].poster_path,
      };
    } else {
      var context = {
        title: array[i].title,
        original_title: array[i].original_title,
        language: '<img src="img/' + array[i].original_language + '.png" alt="Flag">',
        vote: stars,
        poster: 'https://image.tmdb.org/t/p/w154'+ array[i].poster_path,
      };
    }
    var html = template(context);

    // Appendo poi il template al container
    $('.movie-container').append(html);
  }

  // Alla fine resetto il paceholder dell'input
  $('input').val(''); //------------ TODO: rendere dinamico?
}

function printErrorMessage(message) {
  $('.error').html(''); //------------ TODO: rendere dinamico?

  var source = $('#error-message-template').html();
  var template = Handlebars.compile(source);

  var context = {
    message: message
  };
  var html = template(context);
  $('.error').append(html);
}

function getVoteOneToFive(number) {
  var voteInteger = number / 2;
  var voteFinal = voteInteger.toFixed();

  return voteFinal;
}

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
}
