document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.registration-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form data
        const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Make AJAX request
        fetch('http://127.0.0.1:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => response.json())
        .then(data => {
            // Check if the login was successful
            if (data.success) {
                // Redirect to prompt.html
                window.location.href = 'prompt.html';
            } else {
                // Handle unsuccessful login (show error message, etc.)
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
    });
});

