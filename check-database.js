const fs = require("fs");
const path = require("path");

const databasePath = path.join(__dirname, "cards_test.json");
const imagesPath = path.join(__dirname, "cards");

console.log("");
console.log("==========================================");
console.log("   CONTROLLO DATABASE ELDENRING-SCRYFALL");
console.log("==========================================");
console.log("");

/* =========================================================
   LETTURA DATABASE
   ========================================================= */

let database;

try {
    const raw = fs.readFileSync(databasePath, "utf8");
    database = JSON.parse(raw);

    console.log("✅ JSON valido.");
} catch (error) {
    console.error("❌ ERRORE nel JSON:");
    console.error(error.message);
    process.exit(1);
}

const cards = Array.isArray(database.cards)
    ? database.cards
    : [];

console.log(`🃏 Carte trovate: ${cards.length}`);
console.log("");

/* =========================================================
   DUPLICATI
   ========================================================= */

const names = new Map();

cards.forEach((card, index) => {

    const name = String(card.name || "").trim();

    if (!name) {
        return;
    }

    if (!names.has(name)) {
        names.set(name, []);
    }

    names.get(name).push(index + 1);
});

const duplicates = [];

for (const [name, positions] of names) {

    if (positions.length > 1) {

        duplicates.push({
            name,
            positions
        });

    }
}

console.log("==========================================");
console.log("DUPLICATI");
console.log("==========================================");

if (duplicates.length === 0) {

    console.log("✅ Nessun nome duplicato.");

} else {

    console.log(`⚠️ Trovati ${duplicates.length} nomi duplicati:`);

    duplicates.forEach(item => {

        console.log(
            `- ${item.name} → righe ${item.positions.join(", ")}`
        );

    });
}

console.log("");

/* =========================================================
   CAMPI MANCANTI
   ========================================================= */

const missingName = [];
const missingImage = [];
const missingType = [];

cards.forEach((card, index) => {

    const position = index + 1;

    if (!card.name || !String(card.name).trim()) {
        missingName.push(position);
    }

    if (!card.image || !String(card.image).trim()) {
        missingImage.push(position);
    }

    if (!card.type_line || !String(card.type_line).trim()) {
        missingType.push(position);
    }
});


console.log("==========================================");
console.log("CARTE SENZA NOME");
console.log("==========================================");

if (missingName.length === 0) {

    console.log("✅ Nessuna carta senza nome.");

} else {

    missingName.forEach(position => {

        const card = cards[position - 1];

        console.log("");
        console.log(`Riga ${position}:`);

        console.log(
            JSON.stringify(card, null, 2)
        );

    });
}

console.log("");


console.log("==========================================");
console.log("CARTE SENZA TYPE_LINE");
console.log("==========================================");

if (missingType.length === 0) {

    console.log("✅ Nessuna carta senza type_line.");

} else {

    missingType.forEach(position => {

        const card = cards[position - 1];

        console.log("");
        console.log(`Riga ${position}:`);
        console.log(`Nome: ${card.name || "(senza nome)"}`);
        console.log(`Type line: ${card.type_line || "(MANCANTE)"}`);
        console.log(`Immagine: ${card.image || "(nessuna)"}`);

    });
}

console.log("");


console.log("==========================================");
console.log("CARTE SENZA IMMAGINE");
console.log("==========================================");

if (missingImage.length === 0) {

    console.log("✅ Nessuna carta senza immagine.");

} else {

    missingImage.forEach(position => {

        const card = cards[position - 1];

        console.log("");
        console.log(`Riga ${position}:`);
        console.log(`Nome: ${card.name || "(senza nome)"}`);
        console.log(`Immagine: ${card.image || "(MANCANTE)"}`);

    });
}

console.log("");

/* =========================================================
   CONTROLLO FILE IMMAGINI
   ========================================================= */

console.log("==========================================");
console.log("CONTROLLO FILE IMMAGINI");
console.log("==========================================");

let imageFiles = [];

try {

    imageFiles = fs.readdirSync(imagesPath);

} catch (error) {

    console.error("❌ Impossibile leggere la cartella:");
    console.error(imagesPath);
    console.error(error.message);

    process.exit(1);
}

let foundImages = 0;
const missingImages = [];

cards.forEach(card => {

    if (!card.image) {
        return;
    }

    const imageName = path.basename(
        String(card.image)
    );

    const possibleNames = [
        imageName,
        imageName.replace(/\.jpg$/i, ".png"),
        imageName.replace(/\.jpeg$/i, ".png"),
        imageName.replace(/\.webp$/i, ".png")
    ];

    const found = possibleNames.some(
        file => imageFiles.includes(file)
    );

    if (found) {

        foundImages++;

    } else {

        missingImages.push({
            name: card.name || "(senza nome)",
            image: imageName
        });

    }
});


console.log(`Immagini trovate: ${foundImages}`);
console.log(`Immagini mancanti: ${missingImages.length}`);

if (missingImages.length > 0) {

    console.log("");
    console.log("IMMAGINI MANCANTI:");

    missingImages.forEach(item => {

        console.log(
            `- ${item.name} → ${item.image}`
        );

    });

} else {

    console.log("✅ Tutte le immagini sono presenti.");

}

console.log("");

/* =========================================================
   RIEPILOGO
   ========================================================= */

console.log("==========================================");
console.log("RIEPILOGO");
console.log("==========================================");

console.log(
    `Carte totali:       ${cards.length}`
);

console.log(
    `Duplicati:          ${duplicates.length}`
);

console.log(
    `Senza nome:         ${missingName.length}`
);

console.log(
    `Senza immagine:     ${missingImage.length}`
);

console.log(
    `Senza type_line:    ${missingType.length}`
);

console.log(
    `Immagini mancanti:  ${missingImages.length}`
);

console.log("");

if (
    duplicates.length === 0 &&
    missingName.length === 0 &&
    missingImage.length === 0 &&
    missingType.length === 0 &&
    missingImages.length === 0
) {

    console.log("🎉 DATABASE SUPERATO IL CONTROLLO!");
    console.log("Tutto sembra coerente.");

} else {

    console.log("⚠️ Sono state trovate alcune anomalie.");
    console.log("Le analizzeremo una per una.");

}

console.log("");

console.log("==========================================");
console.log("CONTROLLO COMPLETATO");
console.log("==========================================");