// Get the dark mode toggle button and stylesheet link
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = darkModeToggle.querySelector('i');

// Get the link element for the dark mode stylesheet
const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

// Check if dark mode is saved in localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
    darkModeStylesheet.href = 'res/css/dark.css';  // Apply dark mode stylesheet
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
} else {
    darkModeStylesheet.href = 'res/css/general.css';  // Apply light mode stylesheet
    darkModeIcon.classList.remove('fa-sun');
    darkModeIcon.classList.add('fa-moon');
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', function() {
    const isDarkMode = darkModeStylesheet.href.includes('dark.css');
    
    if (isDarkMode) {
        // Switch to light mode
        darkModeStylesheet.href = 'res/css/general.css';  // Apply light mode stylesheet
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
        localStorage.setItem('dark-mode', 'disabled');
    } else {
        // Switch to dark mode
        darkModeStylesheet.href = 'res/css/dark.css';  // Apply dark mode stylesheet
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
        localStorage.setItem('dark-mode', 'enabled');
    }
});
