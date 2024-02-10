document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.querySelector('.registration-form');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Validate form data
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            country: document.getElementById('country').value,
            region: document.getElementById('region').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value,
            agree: document.getElementById('agree').checked
        };

        // Make AJAX request
        fetch('http://127.0.0.1:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            // Check if the registration was successful
            if (data.success) {
                // Redirect to login.html
                window.location.href = 'login.html';
            } else {
                // Handle unsuccessful registration
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
        });
    });

    function validateForm() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const agreeCheckbox = document.getElementById('agree');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Password and confirm password validation
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Password and Confirm Password do not match.');
            return false;
        }

        // Agreement checkbox validation
        if (!agreeCheckbox.checked) {
            alert('Please agree to the terms and conditions.');
            return false;
        }

        return true;
    }
});


// Function to fetch user's location and update the country and region fields
function fetchUserLocation() {
    // Using HTML5 Geolocation API to get user's location
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    // Fetch the user's position coordinates
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Using reverse geocoding API to get country and region
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
            // Update the country and region input fields
            document.getElementById('country').value = data.countryName;
            document.getElementById('region').value = data.principalSubdivision;
        })
        .catch(error => console.log('Error fetching location: ', error));
}

function error() {
    console.log('Error getting user location.');
}

// Call the fetchUserLocation function when the page loads
fetchUserLocation();