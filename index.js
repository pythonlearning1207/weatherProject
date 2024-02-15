import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', async(req, res)=>{
    const location = 'cupertino'
    const result = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=YJC2XAH9LBH2SPM46HZS9W38N&contentType=json`);
    // const description = JSON.stringify(result.description);
    // console.log(description);
    res.render('index.ejs', { content: JSON.stringify(result.data.description)})
})

app.listen(port, (req, res)=>{
    console.log(`Server listening on port ${port}`);
})