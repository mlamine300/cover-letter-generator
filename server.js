
import express from "express"
import fs from "fs"
import path from "path"
import puppeteer from "puppeteer"
import { v4 as uuid } from "uuid"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

import generatePdf from "./pdf/generatePdf.js";


app.use("/cover-letters", express.static(path.join(__dirname, "public/cover-letters")));
app.use("/cvs", express.static(path.join(__dirname, "public/cvs")));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("PDF API OK");
});
app.post("/generate", async (req, res) => {
    try {
        const {
            name,
            companyName,
            companySubtitle = "",
            subject,
            contact = {},
            paragraphs = [],
            signature = ""
        } = req.body;

        if (!name || !companyName || !subject || !paragraphs.length) {
            return res.status(400).json({
                error: "name, companyName, subject et paragraphs sont obligatoires."
            });
        }

        const contactHtml = Object.entries(contact)
            .map(([key, value]) => `<div><strong>${key}</strong> : ${value}</div>`)
            .join("");

        const paragraphsHtml = paragraphs
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("");

        const html = `
<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<style>

*{
    box-sizing:border-box;
}

body{

    font-family:'Inter',sans-serif;
    color:#333;

    padding:20px 15px;

    font-size:14px;
    line-height:1.8;
}

.header{
    margin-bottom:5px;
}

.name{

    font-size:20px;
    font-weight:800;

    color:#111;

    margin-bottom:5px;
}

.contact{

    color:#666;

    font-size:12px;

    line-height:1.2;
}

.separator{

    height:1px;

    background:#d9d9d9;

    margin:2px 0;
}

.company{

    text-align:center;

    margin:2px 0;
}

.company-name{

    font-size:16px;

    font-weight:600;

    color:#444;
}
    .attention{
    
    font-size:14px;

    font-weight:400;

    color:#444
    }

.company-subtitle{

    color:#777;

    margin-top:5px;

    font-size:14px;
}

.subject{

    margin:35px 0;

    font-size:18px;

    font-weight:700;
}

p{

    margin:18px 0;

    text-align:justify;
}
.paragraph{
    font-family:'Inter';
    font-size:12px;

    font-weight:400;
}
.signature{

    margin-top:55px;

    text-align:right;
}

.signature img{

    width:170px;

    margin-bottom:8px;
}

.signature-name{

    font-size:18px;

    font-weight:700;
}

</style>

</head>

<body>

<div class="header">

<div class="name">
${name}
</div>

<div class="contact">
${contactHtml}
</div>

</div>

<div class="separator"></div>

<div class="company">

<div class="company-name">
 ${companyName}

</div>

${
companySubtitle
? `<div class="company-subtitle">${companySubtitle}</div>`
: ""
}

</div>

<div class="separator"></div>

<div class="subject">
Objet : ${subject}
</div>
<div class="paragraph">
${paragraphsHtml}
</div>
<div class="signature">

${
signature
? `<img src="${signature}" />`
: ""
}

<div class="signature-name">
${name}
</div>

</div>

</body>

</html>
`;

//        const browser = await puppeteer.launch({
//   headless: "new",
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-dev-shm-usage",
//     "--disable-gpu",
//   ],
// });
const launchOptions = {
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ],
};

if (process.env.CHROME_EXECUTABLE_PATH) {
  launchOptions.executablePath = process.env.CHROME_EXECUTABLE_PATH;
}

const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();

        await page.setViewport({
            width: 1240,
            height: 1754
        });

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        // const pdf = await page.pdf({
        //     format: "A4",
        //     printBackground: true,
        //     preferCSSPageSize: true,
        //     margin: {
        //         top: "4mm",
        //         bottom: "4mm",
        //         // left: "4mm",
        //         // right: "4mm"
        //     }
        // });

        // await browser.close();

        // res.set({
        //     "Content-Type": "application/pdf",
        //     "Content-Disposition": 'attachment; filename="lettre-motivation.pdf"'
        // });

        //res.send(pdf);

        const filename = `${uuid()}.pdf`;

const filepath = path.join(
    __dirname,
    "public",
    "cover-letters",
    filename
);

await page.pdf({
    path: filepath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
        top: "20mm",
        bottom: "20mm",
        left: "18mm",
        right: "18mm"
    }
});

await browser.close();

const baseUrl =
    process.env.BASE_URL ||
    `${req.protocol}://${req.get("host")}`;

res.json({

    success: true,

    url: `${baseUrl}/cover-letters/${filename}`

});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
});



function generateNewCVHtmlold(cv) {
    // 1. Vérification de la présence et de la validité de tous les champs requis
    
    if (!cv || typeof cv !== 'object') {
        throw new Error("L'objet racine 'cv' est manquant.");
    }
    
  
    const requiredFields = ['titre', 'profil', 'competences', 'experiences', 'formations'];
    
    for (const field of requiredFields) {
        if (!cv[field]) {
            throw new Error(`Le champ obligatoire 'cv.${field}' est manquant.`);
        }
    }
    
    if (!Array.isArray(cv.competences)) {
        throw new Error("Le champ 'cv.competences' doit être un tableau.");
    }
    if (!Array.isArray(cv.experiences)) {
        throw new Error("Le champ 'cv.experiences' doit être un tableau.");
    }
    if (!Array.isArray(cv.formations)) {
        throw new Error("Le champ 'cv.formations' doit être un tableau.");
    }

    // 2. Traitement du titre principal
    const parts = cv.titre.split(" - ");
    const name = parts[0] ? parts[0].toUpperCase() : "LAOUFI MOHAMED LAMINE";
    const subtitle = parts[1] ? parts[1] : "Alternant Transport & Logistique Internationale";

    // 3. Répartition intelligente des compétences dans la grille à 3 colonnes du nouveau modèle
    const categorizedSkills = {
        supplyChain: { title: "Supply Chain & Operations", items: [] },
        softSkills: { title: "Soft Skills", items: [] },
        analyse: { title: "Analyse & Optimisation", items: [] },
        data: { title: "Data", items: [] },
        informatique: { title: "Informatique", items: [] }
    };

    cv.competences.forEach(comp => {
        const lower = comp.toLowerCase();
        if (lower.includes("supply chain") || lower.includes("flux") || lower.includes("planification") || lower.includes("ordonnancement") || lower.includes("procédures") || lower.includes("sécurité")) {
            categorizedSkills.supplyChain.items.push(comp);
        } else if (lower.includes("analyse de performance") || lower.includes("optimisation des processus") || lower.includes("modélisation") || lower.includes("décision") || lower.includes("kpi")) {
            categorizedSkills.analyse.items.push(comp);
        } else if (lower.includes("power bi") || lower.includes("excel") || lower.includes("analysis") || lower.includes("intelligence") || lower.includes("visualization") || lower.includes("python") || lower.includes("data")) {
            categorizedSkills.data.items.push(comp);
        } else if (lower.includes("sql") || lower.includes("erp") || lower.includes("wms") || lower.includes("javascript") || lower.includes("typescript") || lower.includes("react") || lower.includes("next.js") || lower.includes("mongodb") || lower.includes("firebase")) {
            categorizedSkills.informatique.items.push(comp);
        } else {
            categorizedSkills.softSkills.items.push(comp);
        }
    });

    // Génération du HTML pour la grille des compétences
    const renderSkillList = (cat) => {
        if (cat.items.length === 0) return '';
        return `
            <div class="skills-subcat">${cat.title}</div>
            <ul class="skills-list">
                ${cat.items.map(item => `<li>${item}</li>`).join('\n                ')}
            </ul>`;
    };

    const competencesHtml = `
        <div class="skills-grid">
            <div class="skills-col">
                ${renderSkillList(categorizedSkills.supplyChain)}
                ${renderSkillList(categorizedSkills.softSkills)}
            </div>
            <div class="skills-col">
                ${renderSkillList(categorizedSkills.analyse)}
                ${renderSkillList(categorizedSkills.data)}
            </div>
            <div class="skills-col">
                ${renderSkillList(categorizedSkills.informatique)}
            </div>
        </div>`;

    // 4. Génération des formations
    const formationsHtml = cv.formations.map(form => {
        let ecoleStr = form.ecole || '';
        let locationStr = 'Dergana-Alger';
        
        if (ecoleStr.includes(',')) {
            const splitted = ecoleStr.split(',');
            ecoleStr = splitted[0].trim();
            locationStr = splitted[1].trim();
        } else if (ecoleStr.includes('INSSET')) {
            locationStr = 'Saint-Quentin';
        }

        return `
        <div class="item-row">
            <div class="item-left">
                <div class="item-title">${form.diplome}</div>
                <div class="item-sub">${ecoleStr}</div>
            </div>
            <div class="item-right">
                <div class="item-title">${form.annee}</div>
                <div class="item-sub">${locationStr}</div>
            </div>
        </div>`;
    }).join('\n');

    // Dates correspondantes d'origine pour préserver l'historique chronologique
    const datesOrigine = {
        "Auditeur Logistique": "11/2025 – Present",
        "Chargé logistique (Planning & Ordonnancement)": "05/2025 – 10/2025",
        "Data Team Leader (Logistique)": "02/2023 – 03/2025",
        "Chargé de la Logistique & Suivi des Opérations": "02/2022 – 02/2023",
        "Chargé Export": "01/2021 – 02/2022"
    };

    // 5. Génération des expériences professionnelles
    const experiencesHtml = cv.experiences.map(exp => {
        const dateVal = datesOrigine[exp.poste] || "En cours";
        const phrases = exp.description ? exp.description.split('.').map(s => s.trim()).filter(s => s.length > 0) : [];
        let detailsHtml = '';
        if (phrases.length > 0) {
            detailsHtml = `
        <ul class="item-details">
            ${phrases.map(p => `<li>${p}</li>`).join('\n            ')}
        </ul>`;
        }

        let entrepriseStr = exp.entreprise || '';
        let locationStr = "Oued Semar-Alger";
        
        if (entrepriseStr.includes('–')) {
            const splitted = entrepriseStr.split('–');
            entrepriseStr = splitted[0].trim();
            locationStr = splitted[1].trim();
        } else if (entrepriseStr.includes('UPS')) {
            locationStr = exp.poste.includes("Data") ? "Hydra-Alger" : "Oued Semar-Alger";
        }

        return `
        <div class="item-row">
            <div class="item-left">
                <div class="item-title">${entrepriseStr}</div>
                <div class="item-sub">${exp.poste}</div>
            </div>
            <div class="item-right">
                <div class="item-title">${dateVal}</div>
                <div class="item-sub">${locationStr}</div>
            </div>
        </div>
        ${detailsHtml}`;
    }).join('\n');

    // 6. Retourne le modèle HTML complet sous forme de texte
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${name}</title>
    <!-- Chargement des polices Merriweather pour les titres et Open Sans pour le corps -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f3f4f6;
            color: #2c3e50;
            line-height: 1.5;
            padding: 40px 15px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .cv-container {
            width: 210mm;
            min-height: 297mm;
            background-color: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 45px 50px;
            display: flex;
            flex-direction: column;
        }
        
        /* En-tête gris-bleu ardoise */
        .header {
            background-color: #3a4e5d;
            color: #ffffff;
            padding: 30px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px;
            margin-bottom: 25px;
        }
        .header-left {
            flex: 0 0 72%;
        }
        .header-right {
            flex: 0 0 23%;
            display: flex;
            justify-content: flex-end;
        }
        .header h1 {
            font-family: 'Merriweather', serif;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .header h2 {
            font-family: 'Open Sans', sans-serif;
            font-size: 13.5px;
            font-weight: 400;
            font-style: italic;
            color: #cbd5e1;
            margin-bottom: 15px;
        }
        
        /* Contacts en deux colonnes */
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1.1fr;
            gap: 8px 15px;
            font-size: 10.5px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            color: #e2e8f0;
        }
        .contact-item i {
            width: 14px;
            margin-right: 8px;
            color: #cbd5e1;
            text-align: center;
        }
        .contact-item a {
            color: #e2e8f0;
            text-decoration: none;
        }
        .contact-item a:hover {
            text-decoration: underline;
        }
        
        /* Photo de profil rectangulaire avec bords arrondis */
        .avatar {
            width: 120px;
            height: 150px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        /* Titres de section avec bordure inférieure */
        .section-title {
            font-family: 'Merriweather', serif;
            font-size: 13.5px;
            font-weight: 700;
            color: #3a4e5d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 25px;
            margin-bottom: 12px;
            border-bottom: 2px solid #3a4e5d;
            padding-bottom: 4px;
        }
        
        /* Textes généraux */
        .profile-text {
            font-size: 11px;
            text-align: justify;
            color: #334155;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        /* Lignes de liste (Expériences & Formations) */
        .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 10px;
            font-size: 11px;
        }
        .item-left {
            flex: 0 0 70%;
        }
        .item-right {
            flex: 0 0 30%;
            text-align: right;
        }
        .item-title {
            font-family: 'Merriweather', serif;
            font-size: 11.5px;
            font-weight: 700;
            color: #1e293b;
        }
        .item-sub {
            font-family: 'Open Sans', sans-serif;
            font-style: italic;
            font-weight: 600;
            color: #475569;
            margin-top: 1px;
        }
        .item-details {
            list-style-type: disc;
            padding-left: 20px;
            margin-top: 4px;
            margin-bottom: 12px;
            font-size: 11px;
            color: #334155;
        }
        .item-details li {
            margin-bottom: 3px;
        }

        /* Grille des compétences à 3 colonnes */
        .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px 25px;
        }
        .skills-col {
            display: flex;
            flex-direction: column;
        }
        .skills-subcat {
            font-family: 'Merriweather', serif;
            font-size: 11px;
            font-weight: 700;
            color: #3a4e5d;
            margin-top: 8px;
            margin-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 2px;
        }
        .skills-list {
            list-style-type: disc;
            padding-left: 15px;
        }
        .skills-list li {
            font-size: 10.5px;
            color: #334155;
            margin-bottom: 3px;
            line-height: 1.35;
        }

        /* Langues */
        .lang-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-top: 5px;
        }
        .lang-item {
            font-size: 11px;
        }
        .lang-name {
            font-family: 'Merriweather', serif;
            font-weight: 700;
            color: #1e293b;
        }
        .lang-level {
            color: #475569;
            font-size: 10.5px;
        }

        /* Centres d'intérêt */
        .interests-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 25px;
            list-style-type: disc;
            padding-left: 20px;
            margin-top: 5px;
        }
        .interests-list li {
            font-size: 11px;
            color: #334155;
        }

        @media print {
            body {
                background-color: #ffffff;
                padding: 0;
            }
            .cv-container {
                box-shadow: none;
                width: 100%;
                padding: 30px 40px;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        
        <!-- En-tête -->
        <header class="header">
            <div class="header-left">
                <h1>${name}</h1>
                <h2>${subtitle}</h2>
                <div class="contact-grid">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:laoufi.mohamed.lamine@gmail.com">laoufi.mohamed.lamine@gmail.com</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>+213 676 21 77 01</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Saint-quentin, 02100 France</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-globe"></i>
                        <a href="https://laoufi-mohamed-lamine.vercel.app/" target="_blank">laoufi-mohamed-lamine.vercel.app/</a>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-linkedin"></i>
                        <a href="https://linkedin.com/in/mohamed-laoufi" target="_blank">linkedin.com/in/mohamed-laoufi</a>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <a href="https://github.com/mlamine300" target="_blank">github.com/mlamine300</a>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <img class="avatar" src="https://ik.imagekit.io/lamine300/photo%20profil%20(2).png" alt="${name}">
            </div>
        </header>

        <!-- Profil -->
        <section>
            <h3 class="section-title">Profil</h3>
            <p class="profile-text">${cv.profil}</p>
        </section>

        <!-- Expériences Professionnelles -->
        <section>
            <h3 class="section-title">Expérience Professionnelle</h3>
            ${experiencesHtml}
        </section>

        <!-- Formation -->
        <section>
            <h3 class="section-title">Formation</h3>
            ${formationsHtml}
        </section>

        <!-- Compétences Clés -->
        <section>
            <h3 class="section-title">Compétences Clés</h3>
            ${competencesHtml}
        </section>

        <!-- Langues -->
        <section>
            <h3 class="section-title">Langues</h3>
            <div class="lang-grid">
                <div class="lang-item">
                    <div class="lang-name">Arabe</div>
                    <div class="lang-level">Langue maternelle</div>
                </div>
                <div class="lang-item">
                    <div class="lang-name">Français</div>
                    <div class="lang-level">TCF C1 (professionnel)</div>
                </div>
                <div class="lang-item">
                    <div class="lang-name">Anglais</div>
                    <div class="lang-level">EF SET C1 (professionnel)</div>
                </div>
            </div>
        </section>

        <!-- Centres d'Intérêt -->
        <section>
            <h3 class="section-title">Centres d'Intérêt</h3>
            <ul class="interests-list">
                <li>Veille technologique & IA</li>
                <li>Développement web</li>
                <li>Lecture business & technologie</li>
                <li>Finance et Technologie (FinTech)</li>
                <li>Physique et Cosmologie</li>
            </ul>
        </section>

    </div>
</body>
</html>`;
}

app.post("/generatecv",async(req,res)=>{

 try {
    const buffer = await generatePdf(req.body);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cv.pdf',
    });

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  }

})


// app.post("/generatecv",async(req,res)=> {
// const {cv}=req.body;
// if(!cv)return res.status(400).json({message:"cv is required"});
// const cvHtml=generateNewCVHtml(cv);



// //   const browser = await puppeteer.launch({
// //   headless: "new",
// //   args: [
// //     "--no-sandbox",
// //     "--disable-setuid-sandbox",
// //     "--disable-dev-shm-usage",
// //     "--disable-gpu",
// //   ],
// // });
// const browser = await puppeteer.launch({
//   executablePath:
//     "/opt/render/project/.render/chrome/opt/google/chrome/google-chrome",
//   headless: true,
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//   ],
// });

//         const page = await browser.newPage();

//         await page.setViewport({
//             width: 1240,
//             height: 1754
//         });

//         await page.setContent(cvHtml, {
//             waitUntil: "networkidle0"
//         });

        

//         const fs = require("fs");
// const path = require("path");
// const { v4: uuid } = require("uuid");

// const filename = `${uuid()}.pdf`;

// const filepath = path.join(
//     __dirname,
//     "public",
//     "cvs",
//     filename
// );

// await page.pdf({
//     path: filepath,
//     format: "A4",
//     printBackground: true,
//     preferCSSPageSize: true,
//     margin: {
//         top: "2mm",
//         bottom: "2mm",
//         left: "2mm",
//         right: "2mm"
//     }
// });

// await browser.close();

// const baseUrl =
//     process.env.BASE_URL ||
//     `${req.protocol}://${req.get("host")}`;

// res.json({

//     success: true,

//     url: `${baseUrl}/cvs/${filename}`

// });

     





// })
const server=app.listen(3000,()=>{
    console.log("Server started");
});
server.keepAliveTimeout = 250000; // 120 seconds
server.headersTimeout = 250000;