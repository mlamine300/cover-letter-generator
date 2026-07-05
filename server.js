const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const path = require("path");

app.use("/cover-letters", express.static(path.join(__dirname, "public/cover-letters")));
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
const browser = await puppeteer.launch({
  executablePath:
    "/opt/render/project/.render/chrome/opt/google/chrome/google-chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ],
});

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

        const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

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

const server=app.listen(3000,()=>{
    console.log("Server started");
});
server.keepAliveTimeout = 250000; // 120 seconds
server.headersTimeout = 250000;