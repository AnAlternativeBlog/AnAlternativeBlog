// Displays the current date in format "Sunday, March 2nd, 2025"
function displayDate() {
    const dateElement = document.getElementById("current-date");
    if (!dateElement) return;
    
    const today = new Date();
    const day = today.getDate();
    
    // Determine suffix
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";
    
    // Format date using Intl.DateTimeFormat for better performance
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(today);
    
    dateElement.textContent = `${weekday}, ${month} ${day}${suffix}, ${year}`;
}

// Reset to homepage - show all sections except terms
function resetToHome() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    history.pushState("", document.title, window.location.pathname);
    
    const sections = document.querySelectorAll("section");
    const termsSection = document.getElementById("terms");
    
    // Show all sections except terms
    sections.forEach(section => {
        if (section !== termsSection) {
            section.style.display = "block";
            setTimeout(() => { section.style.opacity = "1"; }, 10);
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
    
    setTimeout(() => {
        targetSection.style.opacity = "1";
        history.pushState(null, null, `#${sectionId}`);
    }, 10);
}

// Initialize page on document load
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const termsSection = document.getElementById("terms");
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    // Hide terms section initially
    if (termsSection) {
        termsSection.style.display = "none";
        termsSection.style.opacity = "0";
    }
    
    // Set up event delegation for navigation
    header.addEventListener('click', function(e) {
        // Handle title click
        if (e.target.classList.contains('blog-title') || e.target.closest('.blog-title')) {
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
    });
    
    // Terms link in footer
    footer.addEventListener('click', function(e) {
        const termsLink = e.target.closest('.terms-link');
        if (termsLink) {
            e.preventDefault();
            showSection(termsLink.getAttribute('data-section'));
        }
    });
    
    // Initialize based on URL hash
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    } else {
        // Show all sections except terms by default
        document.querySelectorAll('section').forEach(section => {
            if (section.id !== "terms") {
                section.style.opacity = "1";
                section.style.display = "block";
            }
        });
    }
    
    // Display current date
    displayDate();
});