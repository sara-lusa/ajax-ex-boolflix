$(document).ready(function() {
  // 9e3b41d15d625e280b597413a544c557
  // https://api.themoviedb.org/3/movie/550?api_key=9e3b41d15d625e280b597413a544c557

  // // Creo evento al click del button
  $('#search').click(function() {
    // Dichiaro in una variabile il valore dell'input
    var valueQuery = $('input').val();
    console.log(valueQuery);

    // Al click, faccio la chiamata ajax all'API,
    // e inserisco il valore dell'input come query di ricerca
    $.ajax(
      {
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
          api_key: '9e3b41d15d625e280b597413a544c557',
          query: valueQuery,
          language: 'it-IT'
        },
        success: function(dataResponse) {
        

          // Con handlebars copio il template della scheda film
          // lo completo con un oggetto contente le info utili
          // Lo appendo poi al container

        },
        error: function() {
          alert('ERROR: ');
        }
      }
    );
  });
});

// FUNCTIONS
// Funzione di
