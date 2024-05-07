// app.js
const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Read data from CSV file
const countriesData = [];
fs.createReadStream('contry.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    if (row.country && row.capital) {
      countriesData.push(row);
    } else {
      console.error('Invalid row:', row);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
    console.log('Countries data:', countriesData); // Add this line for debugging
  });

// Route to handle suggestions
app.get('/suggest', (req, res) => {
    const partialName = req.query.partial.toLowerCase();
    console.log('Partial name:', partialName); // Add this line for debugging
    const suggestions = countriesData.filter(country => 
      country.country && country.capital && 
      country.country.toLowerCase().includes(partialName))
      .map(country => ({ country: country.country, capital: country.capital }));
    res.json(suggestions);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
