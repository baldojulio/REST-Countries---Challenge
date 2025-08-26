"use strict";
import {
	fetchCountries,
	fetchCountryByName,
	renderHTML,
	fetchCountryByRegion,
} from "./utils/utils.js";

import {
	applyTheme,
	getEffectiveTheme,
	updateToggleUI,
	loadSavedTheme,
	saveTheme,
} from "./utils/theme.js";

export const elements = {
	SEARCH_INPUT: document.getElementById("searchInput"),
	REGION_SELECT: document.getElementById("regionSelect"),
	TOOGLE_THEME: document.getElementById("toggleTheme"),
};

// When the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
	try {
		// Initialize theme from saved preference
		loadSavedTheme();
		updateToggleUI();

		// It just renders 8 countries
		fetchCountries().then(function (countries) {
			renderHTML(countries);
		});
	} catch (error) {
		console.error("Error in DOMContentLoaded:", error.message);
	}
});

elements.SEARCH_INPUT.addEventListener("input", async function (event) {
	if (!event.target.value) {
		fetchCountries().then(function (countries) {
			renderHTML(countries);
		});

		return;
	}

	fetchCountryByName(event.target.value).then(function (country) {
		renderHTML(country);
	});
});

elements.REGION_SELECT.addEventListener("change", async function (event) {
	const selectedRegion = event.target.value;

	return selectedRegion === ""
		? fetchCountries().then(function (countries) {
				renderHTML(countries);
		  })
		: fetchCountryByRegion(selectedRegion).then(function (countriesByRegion) {
				renderHTML(countriesByRegion);
		  });
});

elements.TOOGLE_THEME.addEventListener("click", function () {
	const current = getEffectiveTheme();
	const next = current === "dark" ? "light" : "dark";
	applyTheme(next);
	saveTheme(next);
	updateToggleUI();
});
