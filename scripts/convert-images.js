const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "..", "cards");
const outputDir = path.join(__dirname, "..", "public", "cards", "webp");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir)
    .filter(file => /\.png$/i.test(file));

async function convert() {
    console.log(`Trovate ${files.length} immagini PNG.`);
    console.log("");

    for (const file of files) {
        const input = path.join(inputDir, file);

        const output = path.join(
            outputDir,
            file.replace(/\.png$/i, ".webp")
        );

        try {
            await sharp(input)
                .resize(600, 840, {
                    fit: "fill"
                })
                .webp({
                    quality: 82
                })
                .toFile(output);

            console.log(`OK: ${file}`);
        } catch (error) {
            console.error(`ERRORE: ${file}`);
            console.error(error.message);
        }
    }

    console.log("");
    console.log("=================================");
    console.log("CONVERSIONE COMPLETATA");
    console.log("=================================");
}

convert();