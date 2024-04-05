const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 
app.set("view engine", "ejs"); 

app.get("/", (req, res) => {
  res.render("index", { title: "Webová anketa" });
});


app.post("/submit", (req, res) => {
  const newResponse = {
    id: Date.now(), 
    timestamp: new Date().toISOString(),
    answers: req.body,
  };

  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data || "");
    json.push(newResponse);

    fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      res.redirect("/results");
    });
  });
});

app.get("/results", (req, res) => {
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('results', { title: "Výsledky ankety", responses }); 
  });
});

app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});