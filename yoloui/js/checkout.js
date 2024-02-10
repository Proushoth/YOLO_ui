const urlParams = new URLSearchParams(window.location.search);
const paymentType = urlParams.get('t');

function setTopicAndPrice(paymentType) {
    const topicElement = document.querySelector(".topic");
    const priceElement = document.querySelector(".price");

    if (paymentType === "premium") {
        topicElement.innerHTML = "Why not a premium package for just";
        priceElement.innerHTML = "$ 5";
    } else if (paymentType === "boost") {
        topicElement.innerHTML = "Why not a boost package for just";
        priceElement.innerHTML = "$ 10";
    } else {
        topicElement.innerHTML = "Choose your package";
        priceElement.innerHTML = "";
    }
}

function premiumPay(){
    
    fetch('http://127.0.0.1:5000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
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
}

setTopicAndPrice(paymentType);
