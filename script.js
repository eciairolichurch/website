document.addEventListener('DOMContentLoaded', () => {
    const songListContainer = document.getElementById('dynamic-song-list');
    const searchInput = document.getElementById('song-search');
    
    // REPLACE THESE WITH YOUR ACTUAL GITHUB DETAILS
    const githubUsername = 'YOUR_GITHUB_USERNAME'; 
    const repoName = 'YOUR_REPOSITORY_NAME';
    const folderPath = 'songs'; // The folder where your .pptx files are

    // The GitHub API URL
    const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${folderPath}`;

    let allSongs = []; // We will store the fetched songs here

    // Function to display songs on the screen
    function renderSongs(songsToDisplay) {
        songListContainer.innerHTML = ''; // Clear current list

        if (songsToDisplay.length === 0) {
            songListContainer.innerHTML = '<li>No songs found matching your search.</li>';
            return;
        }

        songsToDisplay.forEach(song => {
            // Remove the .pptx extension for a cleaner display name
            const cleanTitle = song.name.replace('.pptx', '').replace(/-/g, ' ').replace(/_/g, ' ');
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${cleanTitle}</span>
                <a href="${song.download_url}" download>Download</a>
            `;
            songListContainer.appendChild(li);
        });
    }

    // 1. Fetch the files directly from your GitHub repository
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filter out anything that isn't a .pptx file
            allSongs = data.filter(file => file.name.endsWith('.pptx'));
            
            // Display all songs initially
            renderSongs(allSongs);
        })
        .catch(error => {
            console.error('Error fetching songs:', error);
            songListContainer.innerHTML = '<li>Error loading songs. Ensure your GitHub repository is public and the details in script.js are correct.</li>';
        });

    // 2. Listen for typed input in the search bar
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter the allSongs array based on what the user types
        const filteredSongs = allSongs.filter(song => {
            return song.name.toLowerCase().includes(searchTerm);
        });

        // Update the screen with the filtered results
        renderSongs(filteredSongs);
    });
});

// --- Initialize AOS (Animate On Scroll) ---
AOS.init({
    duration: 800,   // How long the animation takes (in milliseconds)
    once: true,      // Set to 'true' so it only animates once when scrolling down
    offset: 100,     // Triggers the animation 100px before the section hits the screen
});

// --- Contact Form Validation & Auto-Clear ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    
    // 1. Aggressive clear when returning to the page (Catch-all)
    window.addEventListener('pageshow', function() {
        contactForm.reset();
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.value = ''); // Forces every box to be empty
    });

    // 2. Validation and Submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent immediate submission to validate first

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');

        const name = nameInput.value;
        const email = emailInput.value;
        const subject = subjectInput.value;

        // Regular expression patterns
        const namePattern = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/;
        const emailPattern = /^[a-z][a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;

        // Clear previous error messages
        document.getElementById('name-error').innerHTML = '';
        document.getElementById('email-error').innerHTML = '';
        document.getElementById('subject-error').innerHTML = '';

        setValid(nameInput);
        setValid(emailInput);
        setValid(subjectInput);

        let valid = true;

        if (!namePattern.test(name)) {
            document.getElementById('name-error').innerHTML = 'Invalid Name. Must start with an uppercase letter and contain only alphabets.';
            setInvalid(nameInput);
            valid = false;
        }

        if (!emailPattern.test(email)) {
            document.getElementById('email-error').innerHTML = 'Invalid Email. Email should be a valid lowercase format.';
            setInvalid(emailInput);
            valid = false;
        }

        if (subject.trim().length < 3) {
            document.getElementById('subject-error').innerHTML = 'Invalid Subject. Please enter a subject (minimum 3 characters).';
            setInvalid(subjectInput);
            valid = false;
        }

        // If all validations pass, submit the form
        if (valid) {
            // Submit the form normally to Formspree
            this.submit();
            
            // THE MAGIC TRICK: Clear the form 10 milliseconds AFTER submitting.
            // This ensures the browser saves the "empty" state in its back-button history.
            setTimeout(() => {
                this.reset();
                const inputs = this.querySelectorAll('input, textarea');
                inputs.forEach(input => input.value = '');
            }, 10);
        }
    });

    // Helper functions to show/hide red borders
    function setInvalid(element) {
        element.classList.add('invalid');
    }

    function setValid(element) {
        element.classList.remove('invalid');
    }
}