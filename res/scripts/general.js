const navBtn = document.getElementById('nav-btn');
const navContainer = document.querySelector('.nav-container');
const navLinks = document.querySelector('.nav-links');

// Toggle the nav links when the button is clicked
navBtn.addEventListener('click', () => {
    navContainer.classList.toggle('open');
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

// Function to show the loading modal
function showLoadingModal() {
    document.getElementById('loading-modal').style.display = 'block';
  }
  
  // Function to hide the loading modal
  function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
  }


  // Hide loading modal after all fetches are complete
Promise.all([
    fetch('/.netlify/functions/get-skills').then(res => res.json()),
    fetch('/.netlify/functions/get-projects').then(res => res.json()),
    fetch('/.netlify/functions/get-certifications').then(res => res.json())
  ])
  .then(() => {
    hideLoadingModal();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    hideLoadingModal(); // Hide the modal even if there's an error
  });
  
  // Handle contact form submission
  const contactForm = document.getElementById('contact-form'); 
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // Show loading modal while submitting the message
    showLoadingModal();
  
    fetch('/.netlify/functions/add-message', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(res => res.json())
    .then(data => {
      hideLoadingModal();
      alert('Message sent successfully!'); 
      contactForm.reset(); 
    })
    .catch(error => {
      hideLoadingModal();
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again later.'); 
    });
  });

// Fetch skills from the API
fetch('/.netlify/functions/get-skills')
    .then(res => res.json())
    .then(skills => {
        const skillsList = document.querySelector('.horizontal-list');
        skillsList.innerHTML = ""; // Clear existing list

        skills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
            skillsList.appendChild(skillItem);
        });
    })
    .catch(error => console.error('Error fetching skills:', error));

// Fetch projects from the API
fetch('/.netlify/functions/get-projects')
    .then(res => res.json())
    .then(projects => {
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.innerHTML = ""; // Clear existing projects

        projects.forEach((project, index) => {
            // Shorten the description if it's too long
            const shortDescription = project.description.length > 100
                ? project.description.substring(0, 100) + "..."
                : project.description;
        
            const projectCard = `
                <div class="project-card" onclick="openModal(${index})">
                    <div class="card-header">
                        <img src="${project.screenshots[0]}" alt="${project.name}" class="cover-photo"> 
                    </div>
                    <div class="card-body">
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-description">${shortDescription}</p> 
                    </div>
                </div>
            `;
            carouselContainer.innerHTML += projectCard;
        });
    })
    .catch(error => console.error('Error fetching projects:', error));

// Open modal with project details
function openModal(index) {
    const modal = document.getElementById('modal');

    // Fetch project details again to ensure you have the latest data
    fetch('/.netlify/functions/get-projects')
        .then(res => res.json())
        .then(projects => {
            const project = projects[index];

            document.getElementById('modal-title').innerText = project.name;
            document.getElementById('modal-description').innerText = project.description;
            document.getElementById('modal-technologies').innerText = project.technologies;
            document.getElementById('modal-demo').href = project.demoLink;
            document.getElementById('modal-demo').innerText = project.demoLink ? "Live Demo" : "Demo Unavailable";

            const screenshotsContainer = document.getElementById('modal-screenshots');
            screenshotsContainer.innerHTML = "";

            project.screenshots.forEach((img, i) => {
                const imgElement = document.createElement('img');
                imgElement.src = img;
                imgElement.alt = project.name + ' screenshot ' + (i + 1);
                imgElement.onclick = () => openMediaView(project.screenshots, i); // Add click handler for media view
                screenshotsContainer.appendChild(imgElement);
            });

            modal.style.display = "flex";
        })
        .catch(error => console.error('Error fetching project details:', error));
}

// Close modal
function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// Function to open the media view
function openMediaView(images, startIndex) {
    const mediaView = document.getElementById('media-view');
    const mediaImage = document.getElementById('media-image');
    let currentIndex = startIndex;

    mediaImage.src = images[currentIndex];
    mediaView.style.display = "flex";

    // Event delegation for better performance and handling dynamically added elements
    mediaView.addEventListener('click', (event) => {
        if (event.target.id === 'prev-btn') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            mediaImage.src = images[currentIndex];
        } else if (event.target.id === 'next-btn') {
            currentIndex = (currentIndex + 1) % images.length;
            mediaImage.src = images[currentIndex];
        } else if (event.target !== mediaImage) { 
            // Close if clicked outside the image, but not on the buttons
            closeMediaView();
        }
    });

    // Close media view
    function closeMediaView() {
        mediaView.style.display = "none";
    }
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target === document.getElementById('modal')) {
        closeModal();
    }
}

// Fetch certifications from the API
fetch('/.netlify/functions/get-certifications')
    .then(res => res.json())
    .then(certifications => {
        const certificatesContainer = document.querySelector('.certificates-container');
        certificatesContainer.innerHTML = ""; // Clear existing certifications

        certifications.forEach(cert => {
            const certDiv = `
                <div class="certificate">
                    <img src="${cert.image}" alt="${cert.name}">
                    <p>${cert.name}</p>
                </div>
            `;
            certificatesContainer.innerHTML += certDiv;
        });
    })
    .catch(error => console.error('Error fetching certifications:', error));

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