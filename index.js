import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const api_key = process.env.API_KEY;
const secret = process.env.SECRET;


app.get("/", async (req, res) => {

    try {
        const response = await axios.get(`https://livescore-api.com/api-client/countries/list.json?&key=${api_key}&secret=${secret}&federation_id=2`);
        const result = response.data;
        
        res.render("index.ejs", { country: result.data.country, header: "UEFA CHAMPIONS LEAGUE", });
        console.log(result.data.country);
        
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
      
});

app.get("/teams", async (req, res) => {
  let teamId = req.query.team_id;
  
  

    try {
        const response = await axios.get(`https://livescore-api.com/api-client/competitions/standings.json?competition_id=244&key=${api_key}&secret=${secret}`);


        const result = response.data; 

        const teams = result.data.table.map(team => {
          const wins = parseInt(team.won, 10);
          const matches = parseInt(team.matches, 10);
          team.win_percentage = (wins / matches) * 100;
          return team;
        });
        
        res.render("teams.ejs", { teams: result.data.table, });
        console.log(result.data.table);
        

        // const teamsInCountry = result.data.table.filter(table => table.name === country);

        
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.redirect("/", {
          error: error.message,
        });
      }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
