const express = require("express");
const path = require("path");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, (err) => {
      if (err) console.log(err);
      else console.log("server running at 5000");
    });
  } catch (err) {
    console.log(err);
  }
};
app.use(express.json());

app.get("/movies/", async (req, res) => {
  const sql = "select movie_name as movieName from movie";
  const value = await db.all(sql);
  res.send(value);
});

app.post("/movies/", async (req, res) => {
  try {
    console.log(req);
    console.log(req.body);
    const details = req.body;
    const { directorId, movieName, leadActor } = details;
    const sql = `INSERT INTO MOVIE(director_id,movie_name,lead_Actor) VALUES(${directorId},'${movieName}','${leadActor}')`;
    const value = await db.run(sql);
    res.send("Movie Successfully Added");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get("/movies/:movieId/", async (req, res) => {
  try {
    const { movieId } = req.params;
    const sql = `select movie_id as movieId,director_id as directorId,movie_name as movieName,lead_actor as leadActor from movie where movie_id=${movieId}`;
    const val = await db.get(sql);
    if (val) res.send(val);
    else res.send("given values doesnot exist");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

app.put("/movies/:movieId/", async (req, res) => {
  try {
    const { movieId } = req.params;
    const details = req.body;
    const { directorId, movieName, leadActor } = details;

    const sql = `UPDATE  movie SET director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}'   where movie_id=${movieId}`;
    const val = await db.run(sql);
    console.log(val);
    res.send("Movie Details Updated");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const sql = `delete from movie where movie_id=${movieId}`;
    const val = await db.run(sql);
    res.send("Movie Removed");
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

app.get("/directors/", async (req, res) => {
  try {
    const sql = `SELECT director_id as directorId,director_name as directorName FROM director`;
    const val = await db.all(sql);
    res.send(val);
  } catch (err) {
    console.log(err);
    res.send(400);
  }
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  try {
    const { directorId } = req.params;
    const sql = `select movie_name as movieName from movie where director_id=${directorId}`;
    const val = await db.all(sql);

    res.send(val);
  } catch (err) {
    console.log(err);
    res.send(err).status(err);
  }
});

intializeDbAndServer();

module.exports = app;
