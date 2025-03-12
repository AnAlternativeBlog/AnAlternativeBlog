// Cache DOM elements to improve performance
let dateElement, termsSection, header, footer;

// Displays the current date in format "Sunday, March 2nd, 2025"
function displayDate() {
    if (!dateElement) return;
    
    const today = new Date();
    const day = today.getDate();
    
    // Determine suffix
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
    
    dateElement.textContent = `${weekday}, ${month} ${day}${suffix}, ${year}`;
}

// Reset to homepage - show all sections except terms
function resetToHome() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    history.pushState("", document.title, window.location.pathname + "#home");
    
    const sections = document.querySelectorAll("section");
    
    if (!termsSection) {
        termsSection = document.getElementById("terms");
    }
    
    // Show all sections except terms
    sections.forEach(section => {
        if (section !== termsSection) {
            section.style.display = "block";
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => { 
                section.style.opacity = "1";
            });
        } else {
            section.style.opacity = "0";
            section.style.display = "none";
        }
    });
}

// Show only one section at a time
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) return;
    
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    sections.forEach(section => {
        if (section.id !== sectionId) {
            section.style.opacity = "0";
            section.style.display = "none";
        }
    });
    
    targetSection.style.display = "block";
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
        targetSection.style.opacity = "1";
        history.pushState(null, null, `#${sectionId}`);
    });
}

// Handle navigation clicks with event delegation
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

// Handle footer terms link click
function handleFooterClick(e) {
    const termsLink = e.target.closest('.terms-link');
    if (termsLink) {
        e.preventDefault();
        showSection(termsLink.getAttribute('data-section'));
    }
}

// Initialize page on document load
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    dateElement = document.getElementById("current-date");
    termsSection = document.getElementById("terms");
    header = document.querySelector('header');
    footer = document.querySelector('footer');
    
    // Hide terms section initially
    if (termsSection) {
        termsSection.style.display = "none";
        termsSection.style.opacity = "0";
    }
    
    // Set up event delegation for navigation
    if (header) {
        header.addEventListener('click', handleNavigation);
    }
    
    // Terms link in footer
    if (footer) {
        footer.addEventListener('click', handleFooterClick);
    }
    
    // Initialize based on URL hash
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    } else {
        // Show all sections except terms by default
        document.querySelectorAll('section').forEach(section => {
            if (section && section.id !== "terms") {
                section.style.opacity = "1";
                section.style.display = "block";
            }
        });
    }
    
    // Display current date
    displayDate();
});