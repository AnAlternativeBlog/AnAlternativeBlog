// Cache DOM elements to improve performance
const DOM = {
    dateElement: null,
    termsSection: null,
    header: null,
    footer: null,
    currentYear: null
};

/**
 * Displays the current date in format "Sunday, March 2nd, 2025"
 */
function displayDate() {
    if (!DOM.dateElement) return;
    
    const today = new Date();
    const day = today.getDate();
    
    // Determine suffix for the day
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";
    
    // Format date using Intl.DateTimeFormat for better performance and localization
    const formatter = new Intl.DateTimeFormat('en-US', { 
        weekday: 'long',
        month: 'long',
        year: 'numeric'
    });
    
    const parts = formatter.formatToParts(today);
    const weekday = parts.find(part => part.type === 'weekday').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    
    DOM.dateElement.textContent = `${weekday}, ${month} ${day}${suffix}, ${year}`;
    
    // Update copyright year in footer
    if (DOM.currentYear) {
        DOM.currentYear.textContent = year;
    }
}

/**
 * Reset to homepage - show all sections except terms
 */
function resetToHome() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    history.pushState("", document.title, window.location.pathname + "#home");
    
    const sections = document.querySelectorAll("section");
    
    if (!DOM.termsSection) {
        DOM.termsSection = document.getElementById("terms");
    }
    
    // Show all sections except terms - with immediate display
    sections.forEach(section => {
        if (section !== DOM.termsSection) {
            section.style.display = "block";
            section.style.opacity = "1";
        } else {
            section.style.opacity = "0";
            section.style.display = "none";
        }
    });
}

/**
 * Show only one section at a time
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) return;
    
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Immediately hide all sections and show only the target
    sections.forEach(section => {
        if (section.id !== sectionId) {
            section.style.opacity = "0";
            section.style.display = "none";
        }
    });
    
    // Display target section immediately
    targetSection.style.display = "block";
    targetSection.style.opacity = "1";
    history.pushState(null, null, `#${sectionId}`);
}

/**
 * Handle navigation clicks with event delegation
 * @param {Event} e - The click event
 */
function handleNavigation(e) {
    // Handle title click
    if (e.target.classList.contains('blog-title') || e.target.closest('.blog-title')) {
        e.preventDefault();
        resetToHome();
        return;
    }
    
    // Handle navigation links
    const navLink = e.target.closest('nav a');
    if (navLink) {
        e.preventDefault();
        const section = navLink.getAttribute('data-section');
        section === 'home' ? resetToHome() : showSection(section);
    }
}

/**
 * Handle footer terms link click
 * @param {Event} e - The click event
 */
function handleFooterClick(e) {
    const termsLink = e.target.closest('.terms-link');
    if (termsLink) {
        e.preventDefault();
        showSection(termsLink.getAttribute('data-section'));
    }
}

/**
 * Check and handle direct URL access with hash
 */
function handleUrlHash() {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const validSections = ['home', 'about', 'blog', 'support', 'contact', 'terms'];
        
        if (validSections.includes(sectionId)) {
            sectionId === 'home' ? resetToHome() : showSection(sectionId);
        } else {
            // Invalid hash, default to home
            resetToHome();
        }
    } else {
        // No hash, show all sections except terms - immediate display
        document.querySelectorAll('section').forEach(section => {
            if (section && section.id !== "terms") {
                section.style.display = "block";
                section.style.opacity = "1";
            } else if (section && section.id === "terms") {
                section.style.display = "none";
                section.style.opacity = "0";
            }
        });
    }
}

/**
 * Initialize page on document load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    DOM.dateElement = document.getElementById("current-date");
    DOM.termsSection = document.getElementById("terms");
    DOM.header = document.querySelector('header');
    DOM.footer = document.querySelector('footer');
    DOM.currentYear = document.getElementById("current-year");
    
    // Hide terms section initially
    if (DOM.termsSection) {
        DOM.termsSection.style.display = "none";
        DOM.termsSection.style.opacity = "0";
    }
    
    // Set up event delegation for navigation
    if (DOM.header) {
        DOM.header.addEventListener('click', handleNavigation);
    }
    
    // Terms link in footer
    if (DOM.footer) {
        DOM.footer.addEventListener('click', handleFooterClick);
    }
    
    // Initialize based on URL hash
    handleUrlHash();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handleUrlHash);
    
    // Display current date and year
    displayDate();
});