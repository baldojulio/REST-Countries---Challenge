"use strict";
import {
	fetchCountries,
	fetchCountryByName,
	renderHTML,
	fetchCountryByRegion,
	debounce,
	showLoading,
	showError,
	fetchCountryByCode
} from "./utils/utils.js";

import {
	applyTheme,
	getEffectiveTheme,
	updateToggleUI,
	loadSavedTheme,
	saveTheme,
} from "./utils/theme.js";

import { closeModal, renderModal } from "./utils/modal.js";

export const elements = {
	SEARCH_INPUT: document.getElementById("searchInput"),
	REGION_SELECT: document.getElementById("regionSelect"),
	TOGGLE_THEME: document.getElementById("toggleTheme"),
	COUNTRIES_CONTAINER: document.getElementById("countriesContainer"),
};

// When the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
	try {
		// Initialize theme from saved preference
		loadSavedTheme();
		updateToggleUI();

		// Initially load limited countries for better performance
		showLoading();
		try {
			const countries = await fetchCountries(undefined, 8);
			renderHTML(countries);
		} catch (error) {
			showError("Failed to load countries. Please try again later.");
		}
	} catch (error) {
		console.error("Error in DOMContentLoaded:", error.message);
	}
});

// Increase performance
const debouncedSearch = debounce(async function (query) {
	try {
		if (!query.trim()) {
			showLoading();
			const countries = await fetchCountries(undefined, 8);
			renderHTML(countries);
			return;
		}

		showLoading();
		const country = await fetchCountryByName(query);
		renderHTML(country);
	} catch (error) {
		showError("Failed to search countries. Please try again.");
	}
}, 300);

elements.SEARCH_INPUT.addEventListener("input", function (event) {
	debouncedSearch(event.target.value);
});

elements.REGION_SELECT.addEventListener("change", async function (event) {
	const selectedRegion = event.target.value;
	showLoading();

	try {
		if (selectedRegion === "") {
			const countries = await fetchCountries(undefined, 8);
			renderHTML(countries);
		} else {
			const countriesByRegion = await fetchCountryByRegion(selectedRegion);
			renderHTML(countriesByRegion);
		}
	} catch (error) {
		showError("Failed to filter countries. Please try again.");
	}
});

elements.TOGGLE_THEME.addEventListener("click", function () {
	const current = getEffectiveTheme();
	const next = current === "dark" ? "light" : "dark";
	applyTheme(next);
	saveTheme(next);
	updateToggleUI();
});

// Event delegation for country clicks
elements.COUNTRIES_CONTAINER.addEventListener("click", function (event) {
	const countryCard = event.target.closest(".country");
	if (!countryCard) return;
	
	const countryCode = countryCard.dataset.countryCode;
	if (!countryCode) return;
	
	handleCountryClick(countryCode);
});

// Event delegation for modal close
document.addEventListener("click", function (event) {
	if (event.target.id === "closeModal" || event.target.id === "modal") {
		closeModal();
	}
});

// TODO(human): Implement this function
function handleCountryClick(countryCode) {
	// This is where you'll implement the detailed country view

	fetchCountryByCode(countryCode).then(function(country) {
		if (!country || country.status) {
			showError("Failed to load country details. Please try again.");
			return;
		}
		
		// Implement modal or detail view rendering here
		renderModal(country[0]);
	}).catch(function(error) {
		showError("Failed to load country details. Please try again.", error);
	});
}
