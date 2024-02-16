import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', async(req, res)=>{
    const location = 'cupertino'
    const today = new Date();
    const now = today.getHours();
    try {
        const result = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=YJC2XAH9LBH2SPM46HZS9W38N&contentType=json`);
        // const description = JSON.stringify(result.description);
        // console.log(description);
        // res.render('index.ejs', { content: JSON.stringify(result.data.description)})
        const hours = [];
        const temps = [];
        const daysTemps = [];
        const datesTime = [];
        if (now <= 18) {
            for (let i = 0; i <=5; i++) {   
                const hourData = result.data.days[0].hours;
                hours.push(hourData[now + i].datetime);
                temps.push(hourData[now + i].temp);
            }
        } else {
            const extrahours = now - 18;
            for (let i = 0; i < (6 - extrahours); i++) {
                const hourData = result.data.days[0].hours[now + i];
                hours.push(hourData.datetime);
                temps.push(hourData.temp);
            }
            for (let i = 0; i < extrahours; i++) {
                const hourData = result.data.days[1].hours[i];
                hours.push(hourData.datetime);
                temps.push(hourData.temp);
            }
        }

        for (let i = 0; i < 6; i++) {
            const dayData = result.data.days[i];
            daysTemps.push(dayData.temp);
            datesTime.push(dayData.datetime);
        }

    
        res.render("index.ejs", {
            cityName: location,
            currentTemp : result.data.currentConditions.temp + '°',
            description: result.data.description,
            feelslike: result.data.currentConditions.feelslike,
            precipitation: result.data.currentConditions.precipprob,
            visibility: result.data.currentConditions.visibility,
            humidity: result.data.currentConditions.humidity,
            hoursinfo: hours,
            tempsinfo: temps,
            daysTemps: daysTemps,
            datesTime: datesTime,
            uvLevel: result.data.currentConditions.uvindex,
            windspeed: result.data.currentConditions.windspeed,
        })
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.send('Failed to fetch weather data');
        return;
    }
   
})

app.listen(port, (req, res)=>{
    console.log(`Server listening on port ${port}`);
})