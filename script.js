const inputField = document.getElementById("countryInput");
const suggestionsList = document.getElementById("suggestions");

inputField.addEventListener("input", async () => {
  const partialCountryName = inputField.value.trim().toLowerCase();
  if (partialCountryName.length === 0) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    const response = await fetch("contry.csv"); // Assuming the CSV file is served from this endpoint
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
    }
    const text = await response.text();
    const data = parseCSV(text);

    console.log("Parsed data:", data); // Add this line for debugging

    const filteredData = data.filter((item) => {
      if (!item || !item.country || !item.capital) {
        console.log("Invalid item:", item);
        return false;
      }
      return item.country.toLowerCase().startsWith(partialCountryName); // Changed condition here
    });

    displaySuggestions(filteredData);
  } catch (error) {
    console.error("Error fetching or parsing CSV data:", error);
  }
});

function parseCSV(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line); // Filter out empty lines
  const headers = lines[0].split(',').map(header => header.trim());

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) {
      console.error('Invalid row:', lines[i]); // Log invalid rows
      continue; // Skip rows with invalid structure
    }
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = values[j];
    }
    data.push(item);
  }
  return data;
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = "";
  suggestions.forEach(({ country, capital }) => { // Changed property names to lowercase
    const listItem = document.createElement("li");
    listItem.textContent = `${country} - ${capital}`;
    listItem.addEventListener("click", () => {
      inputField.value = country;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(listItem);
  });
}
