// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Create a modal element and append it to the body
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.display = 'none'; // Initially hidden
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-button">&times;</span>
    <img id="modalImage" src="" alt="NASA Image" />
    <h2 id="modalTitle"></h2>
    <p id="modalDate"></p>
    <p id="modalExplanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Function to open the modal with image details
function openModal(imageSrc, title, date, explanation) {
  // Set the modal content
  document.getElementById('modalImage').src = imageSrc;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDate').textContent = `Date: ${date}`;
  document.getElementById('modalExplanation').textContent = explanation;

  // Display the modal
  modal.style.display = 'flex'; // Use flex to center the modal
  document.body.style.overflow = 'hidden'; // Disable background scrolling
}

// Close the modal when the close button is clicked
modal.querySelector('.close-button').addEventListener('click', () => {
  modal.style.display = 'none'; // Hide the modal
  document.body.style.overflow = 'auto'; // Re-enable background scrolling
});

// Close the modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none'; // Hide the modal
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
  }
});

// Your NASA API key
const apiKey = 'v3gv1kcO0mN6ODplMVmR1KV6o0aIQopL0X9SibYB'; // Replace 'YOUR_API_KEY_HERE' with your actual API key

// Function to fetch images from NASA's APOD API
function fetchImages(startDate, endDate) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
  
  const gallery = document.getElementById('gallery');
  const loadingAnimation = document.getElementById('loadingAnimation');
  
  // Show the loading animation and hide the gallery
  loadingAnimation.style.display = 'flex';
  gallery.style.display = 'none';

  // Fetch data from the API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Ensure the loading animation is visible for at least 2 seconds
      setTimeout(() => {
        // Hide the loading animation and show the gallery
        loadingAnimation.style.display = 'none';
        gallery.style.display = 'flex';

        // Call a function to display the images in the gallery
        displayImages(data);
      }, 2000); // 2-second delay
    })
    .catch(error => {
      console.error('Error fetching data from NASA API:', error);
      loadingAnimation.style.display = 'none'; // Hide the loading animation
      gallery.innerHTML = '<p class="error-message">❌ Failed to load space photos. Please try again later.</p>'; // Show error message
      gallery.style.display = 'block'; // Ensure the gallery is visible
    });
}

// Function to display images or videos in the gallery
function displayImages(entries) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear any existing content

  entries.forEach(entry => {
    // Create a gallery item for each entry
    const item = document.createElement('div');
    item.className = 'gallery-item';

    // Check if the entry is an image or a video
    if (entry.media_type === 'image') {
      // Handle image entries
      item.innerHTML = `
        <img src="${entry.url}" alt="${entry.title}" />
        <p>${entry.title}</p>
      `;
      // Add a click event to open the modal with image details
      item.addEventListener('click', () => {
        openModal(entry.url, entry.title, entry.date, entry.explanation);
      });
    } else if (entry.media_type === 'video') {
      // Handle video entries
      item.innerHTML = `
        <iframe src="${entry.url}" frameborder="0" allowfullscreen></iframe>
        <p>${entry.title}</p>
        <a href="${entry.url}" target="_blank" class="video-link">Watch Video</a>
      `;
    }

    gallery.appendChild(item);
  });
}

// Array of fun space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Jupiter has 79 moons, the most of any planet in our solar system.",
  "The Sun accounts for 99.86% of the mass in our solar system.",
  "Neutron stars are so dense that a sugar-cube-sized amount of their material would weigh a billion tons.",
  "Saturn's moon Titan has a thick atmosphere and is the only moon known to have rivers and lakes.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy."
];

// Function to display a random space fact
function displayRandomFact() {
  const factSection = document.getElementById('spaceFact');
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factSection.textContent = `🌌 Did You Know? ${randomFact}`;
}

// Call the function to display a random fact on page load
displayRandomFact();

// Add an event listener to the button to fetch images
document.querySelector('button').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  fetchImages(startDate, endDate);
});

// Add an event listener to the Fact Flash button to display a new random fact
const factFlashButton = document.getElementById('factFlashButton');
factFlashButton.addEventListener('click', displayRandomFact);
