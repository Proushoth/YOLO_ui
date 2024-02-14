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
        fetch('http://127.0.0.1:5000/admin/login', {
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
                console.log(data)
                admin_id = data.admin_id
                admin_hash = data.admin_hash
                // Redirect to prompt.html
                Cookies.set("admin_id", admin_id, { expires: 7 }); 
                Cookies.set("admin_hash", admin_hash, { expires: 7 });
                window.location.href = 'admin-dashboard.html';
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

