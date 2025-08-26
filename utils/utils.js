"use strict";
const defaultFields = [
	"flags",
	"name",
	"population",
	"region",
	"capital",
	"cca3",
];

export function debounce(func, delay) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
}

export async function fetchCountries(fields = defaultFields, limit = null) {
	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/all?fields=${fields}`
		);
		const countries = await response.json();
		return limit ? countries.slice(0, limit) : countries;
	} catch (error) {
		console.error("Error fetching countries:", error.message);
		return [];
	}
}

export async function fetchCountryByName(name) {
	if (!name || typeof name !== "string" || name.trim().length === 0) {
		return { status: 400 };
	}

	try {
		const encodedName = encodeURIComponent(name.trim());
		const response = await fetch(
			`https://restcountries.com/v3.1/name/${encodedName}`
		);
		if (!response.ok) {
			return { status: response.status };
		}
		const countryName = await response.json();
		return countryName;
	} catch (error) {
		console.error("Error fetching country by name:", error.message);
		return { status: 404 };
	}
}

export function showLoading() {
	const countriesContainerElement =
		document.getElementById("countriesContainer");
	if (!countriesContainerElement) {
		console.error("Countries container element not found");
		return;
	}
	countriesContainerElement.innerHTML =
		'<p class="loading">Loading countries...</p>';
}

export function showError(message) {
	const countriesContainerElement =
		document.getElementById("countriesContainer");
	if (!countriesContainerElement) {
		console.error("Countries container element not found");
		return;
	}

	if (!message || typeof message !== "string") {
		message = "An error occurred. Please try again.";
	}

	// Basic HTML escaping to prevent XSS
	const safeMessage = message.replace(/[<>&"']/g, function (match) {
		const escapeMap = {
			"<": "&lt;",
			">": "&gt;",
			"&": "&amp;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return escapeMap[match];
	});

	countriesContainerElement.innerHTML = `<p class="error">${safeMessage}</p>`;
}

export function renderHTML(countries) {
	const countriesContainerElement =
		document.getElementById("countriesContainer");
	if (!countriesContainerElement) {
		console.error("Countries container element not found");
		return;
	}

	const userLocale = navigator.language || "en-US";

	if (!countries) {
		showError("No countries found.");
		return;
	}

	if (countries.status === 404 || countries.status === 400) {
		showError("No countries found matching your search.");
		return;
	}

	if (Array.isArray(countries) && countries.length === 0) {
		showError("No countries found.");
		return;
	}

	if (!Array.isArray(countries)) {
		console.error("Invalid countries data format");
		showError("Error loading countries data.");
		return;
	}

	let countriesHTML = countries
		.map(function (country) {
			const flagAlt =
				country.flags?.alt ||
				`Flag of ${country.name?.common || "Unknown Country"}`;
			const population = country?.population
				? country.population.toLocaleString(userLocale)
				: "N/A";
			const capital = country?.capital
				? Array.isArray(country.capital)
					? country.capital.join(", ")
					: country.capital
				: "N/A";

			return `
            <div class="country" data-country-code="${
							country.cca3 || ""
						}" role="button" tabindex="0">
                <img class="country-flag" src="${
									country.flags?.png
								}" alt="${flagAlt}" />
                <div class="country-info">
                    <h2 class="country-name">${
											country.name?.common || "Unknown"
										}</h2>
                    <p><strong>Population:</strong> ${population}</p>
                    <p><strong>Region:</strong> ${country?.region || "N/A"}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                </div>
            </div>`;
		})
		.join("");

	countriesContainerElement.innerHTML = countriesHTML;
}

export async function fetchCountryByRegion(region) {
	if (!region || typeof region !== "string" || region.trim().length === 0) {
		return [];
	}

	const validRegions = ["africa", "america", "asia", "europe", "oceania"];
	const normalizedRegion = region.trim().toLowerCase();

	if (!validRegions.includes(normalizedRegion)) {
		console.warn(
			`Invalid region: ${region}. Valid regions are: ${validRegions.join(", ")}`
		);
		return [];
	}

	try {
		const response = await fetch(
			`https://restcountries.com/v3.1/region/${normalizedRegion}`
		);
		if (!response.ok) {
			return [];
		}
		const countriesByRegion = await response.json();
		return countriesByRegion;
	} catch (error) {
		console.error("Error fetching countries by region:", error.message);
		return [];
	}
}

export async function fetchCountryByCode(code) {
	if (!code || typeof code !== "string" || code.trim().length === 0) {
		return { status: 400 };
	}

	try {
		const encodedCode = encodeURIComponent(code.trim());
		const response = await fetch(
			`https://restcountries.com/v3.1/alpha/${encodedCode}`
		);
		if (!response.ok) {
			return { status: response.status };
		}
		const countryByCode = await response.json();
		return countryByCode;
	} catch (error) {
		console.error("Error fetching country by code:", error.message);
		return { status: 404 };
	}
}