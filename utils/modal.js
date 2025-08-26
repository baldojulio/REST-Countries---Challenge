export function renderModal(country) {
	const modalContent = document.getElementById("modalContent");
	if (!modalContent) {
		console.error("Modal content element not found");
		return;
	}

	// Extract and format country data
	const userLocale = navigator.language || "en-US";
	const nativeName = country.name?.nativeName
		? Object.values(country.name.nativeName)[0]?.common
		: "N/A";
	const population = country.population
		? country.population.toLocaleString(userLocale)
		: "N/A";
	const capital = country.capital
		? Array.isArray(country.capital)
			? country.capital.join(", ")
			: country.capital
		: "N/A";
	const topLevelDomain = country.tld ? country.tld.join(", ") : "N/A";

	// Format currencies
	const currencies = country.currencies
		? Object.values(country.currencies)
				.map((curr) => curr.name)
				.join(", ")
		: "N/A";

	// Format languages
	const languages = country.languages
		? Object.values(country.languages).join(", ")
		: "N/A";

	// Format border countries
	const borderCountries = country.borders
		? country.borders
				.map((border) => `<button class="border-btn">${border}</button>`)
				.join("")
		: "<span>No border countries</span>";

	let countryHTML = `
			<button id="closeModal" aria-label="Close modal">&larr; Back</button>
				 <div id="country-info">
					<img src="${country.flags?.png}" alt="${
		country.flags?.alt || `Flag of ${country.name?.common}`
	}">
					<div>
						<h2 id="countryName">${country.name?.common || "Unknown"}</h2>
						<div id="countryDetails">
							<p><strong>Native Name:</strong> ${nativeName}</p>
							<p><strong>Population:</strong> ${population}</p>
							<p><strong>Region:</strong> ${country.region || "N/A"}</p>
							<p><strong>Sub Region:</strong> ${country.subregion || "N/A"}</p>
							<p><strong>Capital:</strong> ${capital}</p>
							<p><strong>Top Level Domain:</strong> ${topLevelDomain}</p>
							<p><strong>Currencies:</strong> ${currencies}</p>
							<p><strong>Languages:</strong> ${languages}</p>
						</div>
						<div id="borderCountriesContainer">
							<strong>Border Countries:</strong>
							<div id="borderCountries">
								${borderCountries}
							</div>
						</div>
					</div>
				 </div>
		`;
	modalContent.innerHTML = countryHTML;

	// Show the modal and prevent body scroll
	const modal = document.getElementById("modal");
	if (modal) {
		modal.style.display = "flex";
		document.body.classList.add("modal-open");
	}
}

// Function to close modal
export function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
}