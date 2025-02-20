
let guessedCountries = [];
let timer = 15 * 60;
let interval;
let countryLayers = {};


document.getElementById("startQuiz").addEventListener("click", () => {
    document.getElementById("quizContainer").style.display = "block";
    document.getElementById("startQuiz").style.display = "none";
    document.getElementById("guessInput").style.display = "inline-block";
    document.getElementById("giveUp").style.display = "inline-block";
    startTimer();
});

let L= require('leaflet');
const map = L.map("map", {

    dragging: false,
    scrollWheelZoom: false,
    boxZoom: false,
    touchZoom: false
}).setView([20, 0], 2);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution: "",
}).addTo(map);


let data = require('world-countries');
data.objects.countries = undefined;
fetch("https://raw.githubusercontent.com/deldersveld/topojson/master/countries/world-countries.json")
    .then(response => response.json())
    .then(data => {
        let topojson = require('topojson-client');
        const countriesGeoJSON = topojson.feature(data, data.objects.countries);

        L.geoJSON(countriesGeoJSON, {
            style: () => ({
                fillColor: "yellow",
                color: "black",
                weight: 1,
            }),
            onEachFeature: (feature, layer) => {
                countryLayers[feature.properties.name] = layer;
            }
        }).addTo(map);
    });

document.getElementById("guessInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const guess = event.target.value.trim();
        event.target.value = "";


        if (countryLayers[guess] && !guessedCountries.includes(guess)) {
            guessedCountries.push(guess);
            updateMap(guess);
            updateScore();
            addToContinentTable(guess);
        }
    }
});

function updateMap(countryName) {
    if (countryLayers[countryName]) {
        countryLayers[countryName].setStyle({ fillColor: "green" });
    }
}

function updateScore() {
    document.getElementById("score").textContent = `${guessedCountries.length} / 196 guessed`;
}

function addToContinentTable(country) {
    const continent = getContinent(country);
    if (continent) {
        document.getElementById(continent).querySelector("ul").innerHTML += `<li>${country}</li>`;
    }
}

function getContinent(country) {
    const continents = {
        "Europe": ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"],
        "North America": ["USA",  "Canada", "Mexico", "Cuba", "Haiti", "Dominican Republic", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Jamaica", "Trinidad and Tobago", "Barbados", "Bahamas", "Saint Kitts and Nevis", "Antigua and Barbuda", "Saint Vincent and the Grenadines", "Saint Lucia", "Grenada", "Dominica", "Belize"],
        "South America": ["Brazil", "Argentina", "Colombia", "Peru", "Venezuela", "Chile", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname"],
        "Oceania": ["Australia", "New Zealand", "Fiji", "Solomon Islands", "Vanuatu", "Samoa", "Kiribati", "Tonga", "Tuvalu", "Palau", "Marshall Islands", "Micronesia", "Nauru", "Papua New Guinea"],
        "Africa": ["Nigeria", "Ethiopia", "Egypt", "DR Congo", "Tanzania", "South Africa", "Kenya", "Uganda", "Sudan", "Algeria", "Morocco", "Angola", "Mozambique", "Ghana", "Madagascar", "Cameroon", "Côte d'Ivoire", "Niger", "Burkina Faso", "Mali", "Malawi", "Zambia", "Senegal", "Chad", "Somalia", "Zimbabwe", "Guinea", "Rwanda", "Benin", "Tunisia", "Burundi", "South Sudan", "Togo", "Sierra Leone", "Libya", "Congo", "Liberia", "Central African Republic", "Mauritania", "Eritrea", "Namibia", "Gambia", "Botswana", "Gabon", "Lesotho", "Guinea-Bissau", "Equatorial Guinea", "Mauritius", "Eswatini", "Djibouti", "Comoros", "Cabo Verde", "Sao Tome and Principe", "Seychelles"],
        "Asia": ["China", "India", "Indonesia", "Pakistan", "Bangladesh", "Japan", "Philippines", "Vietnam", "Turkey", "Iran", "Thailand", "Myanmar", "South Korea", "Iraq", "Afghanistan", "Saudi Arabia", "Uzbekistan", "Malaysia", "Yemen", "Nepal", "North Korea", "Sri Lanka", "Kazakhstan", "Syria", "Cambodia", "Jordan", "Azerbaijan", "United Arab Emirates", "Tajikistan", "Brunei", "Kyrgyzstan", "Laos", "Lebanon", "Turkmenistan", "Singapore", "Oman","Qatar", "Kuwait", "East Timor", "Bahrain", "Cyprus", "Armenia", "Maldives", "Bhutan"],
    };

    for (const [continent, countries] of Object.entries(continents)) {
        if (countries.includes(country)) {
            return continent.toLowerCase().replace(" ", "-");
        }
    }
    return null;
}

function startTimer() {
    interval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(interval);
            alert("Time's up!");
        } else {
            timer--;
            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }, 1000);
}
document.getElementById("giveUp").addEventListener("click", () => {
    clearInterval(interval);
    guessedCountries = Object.keys(countryLayers);
    guessedCountries.forEach(updateMap);
    updateScore();
});
