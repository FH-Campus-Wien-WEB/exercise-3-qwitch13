/* template */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));
/* template */

/* START - Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  const allGenres = Object.values(movieModel).flatMap(function (movie) {
    return movie.Genres;
  });

  /** Set removes duplicates, Array.from converts back to a sortable array. */
  const uniqueSorted = Array.from(new Set(allGenres)).sort();

  res.json(uniqueSorted);
});
/* END - Task 1.2 */

/* START - Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given,
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel)

  if (req.query.genre) { // added
    movies = movies.filter(function (movie) {
      return movie.Genres.includes(req.query.genre);
    });
  }

  res.json(movies); // changed: was 'res.send(movies)'
})
/* END - Task 1.4 */

/* template */
// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel

  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }

})

app.listen(3000) // start the server on port 3000

console.log("Server now listening on http://localhost:3000/")
/* template */
