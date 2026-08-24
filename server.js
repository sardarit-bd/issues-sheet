import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { searchGoogleSheet } from "./src/services/googleSheetService.js";
import analyzeQuery from "./src/services/queryAnalyzer.js";
import askFromSheet from "./src/utils/askFromSheet.js";

/******** Express App ********/
const app = express();

/******** PORT Define ********/
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"src" ,"views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));



/******** Test Route ********/
app.get('/',  async (req, res) => {

   res.render("index", {
        title: "AI Project Management",
        message: "Welcome to AI First Project Management System 🚀"
    });
});



/******** Chat Route ********/
app.post('/', async (req, res) => {
  try {
    const bodyPrompt = req?.body?.prompt;
    const analyzedQuery = analyzeQuery(bodyPrompt);
    const result = await searchGoogleSheet(analyzedQuery.searchQuery || analyzedQuery.normalized);


    // create answer
    const answer = await askFromSheet(analyzedQuery?.normalized,result?.records);

    console.log(answer);

    res.status(200).json({
     answer:answer
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Something went wrong."
    });
  }
});




/******** Start Server ********/
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT} in ${environment} mode`);
});
