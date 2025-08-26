import { elements } from "../app.js";

const ICONS = {
	SUN: "./icons/sun-solid-full.svg",
	MOON: "./icons/moon-solid-full.svg",
};

export function applyTheme(theme) {
	const root = document.documentElement; // <html>
	root.classList.remove("force-light", "force-dark");
	if (theme === "light") root.classList.add("force-light");
	if (theme === "dark") root.classList.add("force-dark");
}

export function getEffectiveTheme() {
	const root = document.documentElement;
	if (root.classList.contains("force-dark")) return "dark";
	if (root.classList.contains("force-light")) return "light";
	// Fallback to system preference
	return window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function updateToggleUI() {
	const current = getEffectiveTheme();
	const btn = elements.TOOGLE_THEME;
	const icon = btn.querySelector("img.icon");
	const label = btn.querySelector("span");
	if (current === "dark") {
		// Show option to switch to light
		icon.src = ICONS.SUN;
		label.textContent = "Light Mode";
	} else {
		// Show option to switch to dark
		icon.src = ICONS.MOON;
		label.textContent = "Dark Mode";
	}
}

export function loadSavedTheme() {
	try {
		const saved = localStorage.getItem("theme"); // 'light' | 'dark' | null
		if (saved === "light" || saved === "dark") {
			applyTheme(saved);
		}
	} catch (error) {
		console.error("Error loading saved theme:", error.message);
	}
}

export function saveTheme(theme) {
	try {
		localStorage.setItem("theme", theme);
	} catch (error) {
		console.error("Error saving theme:", error.message);
	}
}