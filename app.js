const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
module.exports = app;
const dbpath = path.join(__dirname, moviesData.db);
let db = null;
const IntialiseDatabseAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at Port No:3000");
    });
  } catch (error) {
    console.log(`Error Message is ${error.message}`);
    process.exit(1);
  }
};
IntialiseDatabseAndServer();

// GET API TO GET ALL MOVIES

app.get("/movies/", async (request, response) => {
  const getallmoviesQuery = `
    SELECT 
    movie_name
    FROM
    movie;`;
  const moviesarray = await db.all(getallmoviesQuery);
  response.send(moviesarray);
});
// POST API TO CREATE NEW MOVIE
app.post("/movies/", async (request, response) => {
  const moviedetails = request.body;
  const { directorId, movieName, leadActor } = moviedetails;
  const createmoviequery = `
    INSERT INTO
    movie(director_id,movie_name,lead_actor)
    VALUES (${directorId},${movieName},${leadActor});`;
  const dbresponse = await db.run(createmoviequery);
  response.send("Movie Successfully Added");
});

// GET SINGLE MOVIE BY MOVIE ID
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getsinglemoviequery = `
    SELECT 
    *
    FROM 
    movie
    where movie_id=${movieId};`;
  const dbresponse = await db.get(getsinglemoviequery);
  response.send(dbresponse);
});
//UPDATE API BY MOVIE ID
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const moviedetails = request.body;
  const { directorId, movieName, leadActor } = moviedetails;
  const updatesqlquery = `
    UPDATE
    movie
    SET
    director_id=${directorId},
    movie_name=${movieName}
    lead_actor=${leadActor}
    where movie_id=${movieId}`;
  await db.run(updatesqlquery);
  response.send("Movie Details Updated");
});
// DELETE API BY MOVIE ID
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletesqlQuery = `
    delete
    from 
    movie
    where movie_id=${movieId};`;
  await db.all(deletesqlQuery);
  response.send("Movie Removed");
});
//GET ALL LIST OF DIRECTORS
app.get("/directors/", async (request, response) => {
  const getallDirectorsquery = `
    select 
    *
    from
    director;`;
  const directorsarray = await db.all(getallDirectorsquery);
  response.send(directorsarray);
});
//GET ALL MOVIES DIRECTED BY SPECIFIC DIRECTOR
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getallmoviesquery = `
    select
    movie_name
    from
    director
    where director_id=${directorId};`;
  const allmoviesarray = await db.all(getallmoviesquery);
  response.send(allmoviesarray);
});
