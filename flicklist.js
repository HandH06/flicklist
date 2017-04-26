

var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {

  root: "https://api.themoviedb.org/3",
  token: "cc39f6d154ae9b04cfd101fe55f3be33",

  /**
   * Given a movie object, returns the url to its poster image
   */
  posterUrl: function(movie) {

    var posterRoot = "http://image.tmdb.org/t/p/w300//";
    var posterPath = movie.poster_path;
    var posterUrl = posterRoot + posterPath;

    return posterUrl;
  }
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      //console.log(response);
    }
  });
}


/**
 * Makes an AJAX request to the /search endpoint of the API, using the 
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {
    // PANEL HEADING
    var panelHeading = $('<div>').attr('class', 'panel-heading');
    var title = $("<h6></h6>").text(movie.original_title);
    panelHeading.append(title);

    // PANEL BODY
    var panelBody = $('<div>').attr('class', 'panel-body');
    // Clicking should remove this movie from the watchlist and re-render
    var watchedButton = $('<button>')
      .text('I watched it')
      .click(function(){
        //console.log(model.watchlistItems);
        //model.watchlistItems
        for (var i = 0; i < model.watchlistItems.length; i++){
          if (model.watchlistItems[i].original_title == movie.original_title){
            //console.log('current ' + model.watchlistItems[i].original_title);
            model.watchlistItems.splice(i, 1);
          }
        }
        render();
      });

    watchedButton.attr('class', 'btn btn-danger');
    
    // add a poster image and append it inside the 
    // panel body above the button
    var movieImage = $('<img>')
      .attr('src', api.posterUrl(movie))
      .attr('class', 'img-responsive')

    panelBody.append(movieImage);
    panelBody.append(watchedButton);
    
    console.log(movie);

    // re-implement the li as a bootstrap panel with a heading and a body
    var itemView = $("<li></li>")
      .append(panelHeading)
      .append(panelBody)
      .attr("class", "panel panel-default");

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    var title = $("<h4></h4>").text(movie.original_title);

    var button = $("<button class='btn btn-primary'></button>")
      .text("Add to Watchlist")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1);

    var overview = $("<p></p>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li class='list-group-item'></li>")
      .append(title)
      .append(overview)
      .append(button);
      
    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });
  
}


// When the HTML document is ready, call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});