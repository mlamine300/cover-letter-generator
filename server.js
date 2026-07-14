
import express from "express"

import path from "path"
// const fs = require('fs').promises;
// const path = require('path');
import fs from "fs/promises"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

import  {generateResumePdf, generateCoverPdf } from "./pdf/generatePdf.js";

function convertToUrlSlug(str) {
  return str
    .toLowerCase()                                     // 1. Lowercase the string
    .normalize("NFD")                                  // 2. Separate accents from letters
    .replace(/[\u0300-\u036f]/g, "")                   // 3. Remove all accents
    .replace(/[^a-z0-9\s-]/g, "")                      // 4. Remove all special characters
    .trim()                                            // 5. Remove leading/trailing spaces
    .replace(/\s+/g, "-")                              // 6. Replace spaces with hyphens
    .replace(/-+/g, "-");                              // 7. Remove consecutive hyphens
}
app.use("/pdf", express.static(path.join(__dirname, "public/pdf")));
//app.use("/cvs", express.static(path.join(__dirname, "public/cvs")));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("PDF API OK");
});

app.post("/generatecover",async(req,res)=>{
    
  try {
        const now=new Date();
        const company= convertToUrlSlug(req.body.entreprise)||"none";
        
    const buffer = await generateCoverPdf(req.body);

    // 1. Définir un nom de fichier unique (avec un timestamp pour éviter les écrasements)
    const fileName = `${company}-cover-ltr-laoufi-mohamed-lamine.pdf`;
    
    // 2. Définir le dossier de stockage sur le serveur (ex: dans un dossier 'public/uploads')
    const uploadDir = path.join(__dirname, 'public','pdf',company,now.getTime().toString());
    
    // Sécurité : Crée le dossier s'il n'existe pas encore
    await fs.mkdir(uploadDir, { recursive: true });

    // Chemin complet du fichier sur le disque
    const filePath = path.join(uploadDir, fileName);

    // 3. Sauvegarder le buffer en tant que fichier PDF
    await fs.writeFile(filePath, buffer);

    // 4. Générer l'URL absolue (fonctionne en local comme en production)
    const fileUrl = `${req.protocol}://${req.get('host')}/pdf/${company}/${now.getTime()}/${fileName}`;

    // 5. Renvoyer l'URL au format JSON
    res.status(200).json({ 
      success: true,
      message: 'coverLetter généré et sauvegardé avec succès',
      coverLetterURL: fileUrl 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation or storage failed');
  }
})


app.post("/generatecv",async(req,res)=>{
http://localhost:3000/pdf/iscod-pour-son-entreprise-partenaire/1783779612137/cv_ltr_laoufi_mohamed_lamine.pdf
   try {
    const now=new Date().getTime().toString();
    const company= convertToUrlSlug(req.body.entreprise)||"none";
    const buffer = await generateResumePdf(req.body);
    
    // 1. Définir un nom de fichier unique (avec un timestamp pour éviter les écrasements)
    const fileName = `cv-${company}-ltr-laoufi-mohamed-lamine.pdf`;
    
    // 2. Définir le dossier de stockage sur le serveur (ex: dans un dossier 'public/uploads')
    const uploadDir = path.join(__dirname, 'public','pdf',company,now );
    
    // Sécurité : Crée le dossier s'il n'existe pas encore
    await fs.mkdir(uploadDir, { recursive: true });

    // Chemin complet du fichier sur le disque
    const filePath = path.join(uploadDir, fileName);

    // 3. Sauvegarder le buffer en tant que fichier PDF
    await fs.writeFile(filePath, buffer);
    

    // 4. Générer l'URL absolue (fonctionne en local comme en production)
    const fileUrl = `${req.protocol}://${req.get('host')}/pdf/${company}/${now}/${fileName}`;

    // 5. Renvoyer l'URL au format JSON
    res.status(200).json({ 
      success: true,
      message: 'CV généré et sauvegardé avec succès',
      resumeURL: fileUrl 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation or storage failed');
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