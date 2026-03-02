// Function to fetch country info and update DOM
async function searchCountry(countryName) {
    const countryInfoSection = document.getElementById('country-info');
    const borderingCountriesSection = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');

    // Clear previous info/errors
    countryInfoSection.innerHTML = '';
    borderingCountriesSection.innerHTML = '';
    errorMessage.innerText = '';

    if (!countryName) return; // Do nothing if input is empty

    // Show loading spinner
    spinner.classList.remove('hidden');

    try {
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        const country = data[0];

        // Update main country info
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Fetch and display bordering countries if they exist
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                try {
                    const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                    if (!borderResponse.ok) continue;
                    const borderData = await borderResponse.json();
                    const borderCountry = borderData[0];

                    const borderDiv = document.createElement('div');
                    borderDiv.innerHTML = `
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                        <p>${borderCountry.name.common}</p>
                    `;
                    borderingCountriesSection.appendChild(borderDiv);
                } catch (err) {
                    // Skip individual border errors silently
                    continue;
                }
            }
        }

    } catch (error) {
        errorMessage.innerText = 'Sorry, country not found or an error occurred.';
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// Event listeners

// Button click
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
});

// Enter key press
document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = e.target.value.trim();
        searchCountry(country);
    }
});
