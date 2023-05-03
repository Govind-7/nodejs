const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");

app.use(express.json());

let db = null;
const initialDBandServo = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server has started");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
initialDBandServo();

app.get("/players/", async (request, response) => {
  const sqliteQuery = `SELECT *
   FROM cricket_team ORDER BY player_id ;`;
  const res = await db.all(sqliteQuery);

  response.send(res);
});

app.post("/players/", async (request, response) => {
  let a = request.body;

  let { playerName, jerseyNumber, role } = a;
  const sqliteQuery = `INSERT INTO
        cricket_team(player_name,jersey_number,role)
        VALUES(
            '${playerName}',
            '${jerseyNumber}',
            '${role}')`;
  const res = await db.run(sqliteQuery);
  response.send("Player Added to Team");
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const sqliteQuery = `
    SELECT *
    FROM cricket_team 
    WHERE 
     player_id=${playerId}`;
  const res = await db.get(sqliteQuery);

  response.send(res);
});
app.put("/players/:playerId/", async (request, response) => {
  let a = request.body;
  let { playerId } = request.params;

  let { playerName, jerseyNumber, role } = a;
  const sqliteQuery = `UPDATE 
        cricket_team
        SET player_name='${playerName}',jersey_number='${jerseyNumber}',
            role='${role}'
        WHERE player_id=${playerId}`;
  const res = await db.run(sqliteQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const sqliteQuery = `
    DELETE 
    FROM cricket_team 
    WHERE 
     player_id=${playerId}`;
  const res = await db.run(sqliteQuery);
  response.send("Player Removed");
});

module.exports = app;
