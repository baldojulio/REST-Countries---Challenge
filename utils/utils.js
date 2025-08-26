"use strict";
const defaultFields = ["flags", "name", "population", "region", "capital"];

export async function fetchCountries(fields = defaultFields) {
	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/all?fields=${fields}`
		);
		const countries = await response.json();
		return countries.slice(0, 8);
	} catch (error) {
		console.error("Error fetching countries:", error.message);
	}
}

export async function fetchCountryByName(name) {
	try {
		const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
		const countryName = await response.json();
		return countryName;
	} catch (error) {
		console.error("Error fetching country by name:", error.message);
	}
}

export function renderHTML(countries) {
	const countriesContainerElement =
		document.getElementById("countriesContainer");
	const userLocale = navigator.language || "en-US";

	if (!countries || countries.status === 404) {
		countriesContainerElement.innerHTML = "<p>No countries found.</p>";
		return;
	}

	let countriesHTML = countries
		.map(function (country) {
			return `
            <div class="country">
                <img class="country-flag" src="${
									country.flags?.png
								}" alt="${country.flags?.alt}" />
                <div class="country-info">
                    <h2 class="country-name">${country.name?.common}</h2>
                    <p><strong>Population:</strong> ${country?.population.toLocaleString(
											userLocale
										)}</p>
                    <p><strong>Region:</strong> ${country?.region}</p>
                    <p><strong>Capital:</strong> ${country?.capital}</p>
                </div>
            </div>`;
		})
		.join("");

	countriesContainerElement.innerHTML = countriesHTML;
}

export async function fetchCountryByRegion(region) {
	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/region/${region}`
		);
		const countriesByRegion = await response.json();
		return countriesByRegion;
	} catch (error) {
		console.error("Error fetching countries by region:", error.message);
	}
}