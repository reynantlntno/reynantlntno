const navBtn = document.getElementById('nav-btn');
const navContainer = document.querySelector('.nav-container');
const navLinks = document.querySelector('.nav-links');

// Toggle the nav links when the button is clicked
navBtn.addEventListener('click', () => {
    navContainer.classList.toggle('open');
});

// Keep the navigation open if hovering over the nav links
navContainer.addEventListener('mouseenter', () => {
    if (!navContainer.classList.contains('open')) {
        navContainer.classList.add('open');
    }
});

navContainer.addEventListener('mouseleave', () => {
    if (!navLinks.matches(':hover')) {
        navContainer.classList.remove('open');
    }
});

// Handle image animation and text reveal
const imageContainer = document.querySelector('.image-container');
const textContainer = document.querySelector('.text-container');
const textElement = document.querySelector('.text-container h1');

imageContainer.addEventListener('animationend', () => {
    imageContainer.style.display = 'none';
    textContainer.style.display = 'block';
    textElement.classList.add('typing');
});

// Sample project data 
const projects = [
    {
        title: "Project 1",
        description: "An innovative web app for managing tasks with real-time collaboration.",
        technologies: "React, Node.js, WebSockets",
        demoLink: "https://example.com/project1",
        screenshots: ["res/imgs/project1-screenshot1.jpg", "res/imgs/project1-screenshot2.jpg"]
    },
    {
        title: "Project 2",
        description: "A creative portfolio website built with a modern front-end stack.",
        technologies: "HTML, CSS, JavaScript",
        demoLink: "https://example.com/project2",
        screenshots: ["res/imgs/project2-screenshot1.jpg", "res/imgs/project2-screenshot2.jpg"]
    },
    // Add more projects here
];

// Open modal with project details
function openModal(index) {
    const modal = document.getElementById('modal');
    const project = projects[index];

    document.getElementById('modal-title').innerText = project.title;
    document.getElementById('modal-description').innerText = project.description;
    document.getElementById('modal-technologies').innerText = project.technologies;
    document.getElementById('modal-demo').href = project.demoLink;
    document.getElementById('modal-demo').innerText = project.demoLink ? "Live Demo" : "Demo Unavailable";

    const screenshotsContainer = document.getElementById('modal-screenshots');
    screenshotsContainer.innerHTML = "";
    project.screenshots.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img;
        screenshotsContainer.appendChild(imgElement);
    });

    modal.style.display = "flex";
}

// Close modal
function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target === document.getElementById('modal')) {
        closeModal();
    }
}

// Example of dynamically generating the certifications section
const certifications = [
    {
        image: "res/imgs/cert1.jpg",
        title: "Certificate in Web Development - Coursera"
    },
    {
        image: "res/imgs/cert2.jpg",
        title: "Certificate in Python Programming - edX"
    },
    // Add more certifications here
];

// Dynamically add certificates to the section
const certificatesContainer = document.querySelector('.certificates-container');
certifications.forEach(cert => {
    const certDiv = document.createElement('div');
    certDiv.classList.add('certificate');

    const img = document.createElement('img');
    img.src = cert.image;
    img.alt = cert.title;
    certDiv.appendChild(img);

    const text = document.createElement('p');
    text.textContent = cert.title;
    certDiv.appendChild(text);

    certificatesContainer.appendChild(certDiv);
});

// Detect when the footer is in view and hide the nav container
const footer = document.querySelector('.footer');

// Function to check if an element is in the viewport
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (rect.top <= window.innerHeight && rect.bottom >= 0);
}

// Function to fade out the nav container when the footer is in view
function checkFooterVisibility() {
    if (isInViewport(footer)) {
        navContainer.classList.add('hide-nav');
    } else {
        navContainer.classList.remove('hide-nav');
    }
}

// Check footer visibility on scroll
window.addEventListener('scroll', checkFooterVisibility);

// Initial check when the page loads
checkFooterVisibility();
