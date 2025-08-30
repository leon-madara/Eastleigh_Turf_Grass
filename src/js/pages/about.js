// About Page JavaScript
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        // Set current year in footer
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });
})();