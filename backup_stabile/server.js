const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Permette di utilizzare i file presenti nella cartella public
app.use(express.static("public"));
app.use("/cards", express.static("cards"));

// Legge il database delle carte
const data = JSON.parse(
fs.readFileSync("./cards_test.json", "utf8")
);

const cards = data.cards;

// API delle carte
app.get("/cards", (req, res) => {
res.json(cards);
});

// Avvia il server
app.listen(PORT, () => {
console.log(`EldenRing-Scryfall avviato su http://localhost:${PORT}`);
});
