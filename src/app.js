const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();


app.use(express.static(path.join(__dirname, '../public')));

const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath);

app.set('view engine', 'hbs');
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath);

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather',
        name: 'Satya'
    });
});
app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Weather',
        name: 'Satya',
        helpText: 'abc@example.com'
    });
});

app.get('/about', (req, res)=>{
    res.render('about',{
        title: 'Weather',
        name: 'Satya'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

app.listen(8080, ()=>{
    console.log("server is up on port 8080");
});