// set our port var to 8000 for localhost
const PORT = process.env.PORT || 8000

// Set up packages as variables so they will function
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

// set the express function call to a var
const app = express()


// Set up the newspapers array
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    }, 
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }
    
]

// set up the articles array for use later
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        const $ =  cheerio.load(html)

        $('a:contains("climate")', html).each(function() {

            const title = $(this).text
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            }) 

        })
    })
})

//request and response to show the message when localhost:8000 is visited
app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
} )

//Set up the /news URL to display any a tags from the guardian website that include the word climate.
//then extract the text and href and push them into our articles array

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId',(req,res) => {
    const newspaperId = req.params.newspaperId

   const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base



    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html). each(function() {

           const title = $(this).text
           const url = $(this).attr('href')

           specificArticles.push({
            title,
            url: newspaperBase + url,
            source: newspaperId

           })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err)) 
        
    
} )

// Tester listen to see nodemon is working
app.listen(PORT, () => console.log('server running on PORT ' + PORT))