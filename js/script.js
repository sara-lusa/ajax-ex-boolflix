$(document).ready(function() {
  // 9e3b41d15d625e280b597413a544c557
  // https://api.themoviedb.org/3/movie/550?api_key=9e3b41d15d625e280b597413a544c557

  // // Creo evento al click del button
  $('#search').click(function() {
    // Dichiaro in una variabile il valore dell'input
    var valueQuery = $('input').val();

    searchAndPrintMovies(valueQuery);
  });

  $('input').keypress(function(event) {
    if(event.which === 13 || event.keyCode === 13) {
      // Dichiaro in una variabile il valore dell'input
      var valueQuery = $('input').val();

      searchAndPrintMovies(valueQuery);
    }
  });
});

// FUNCTIONS
// Funzione di chiamata ajax e handlbars
function searchAndPrintMovies(valueQuery) {
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
        var arrayMovies = dataResponse.results;

        // Con handlebars copio il template della scheda film
        // lo completo con un oggetto contente le info utili
        // Lo appendo poi al container
        $('.movie-container').html('');

        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);

        for (var i = 0; i < arrayMovies.length; i++) {
          console.log(arrayMovies[i].title);

          var context = {
            title: arrayMovies[i].title,
            original_title: arrayMovies[i].original_title,
            language: arrayMovies[i].original_language,
            vote: arrayMovies[i].vote_average,
          };
          var html = template(context);

          $('.movie-container').append(html);
        }

        $('input').val(''); //------------ TODO: rendere dinamico?
      },
      error: function(richiesta, stato, errori) {
        alert('ERROR:' +  errori);
      }
    }
  );
}
