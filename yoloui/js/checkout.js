const urlParams = new URLSearchParams(window.location.search);
const paymentType = urlParams.get('t');
var lookup_key;
var formData;

function setTopicAndPrice(paymentType) {
    const topicElement = document.querySelector(".topic");
    const priceElement = document.querySelector(".price");

    if (paymentType === "premium") {
        topicElement.innerHTML = "Why not a premium package for just";
        priceElement.innerHTML = "$ 5";
        lookup_key = "yolo_premium_test";
    } else if (paymentType === "boost") {
        topicElement.innerHTML = "Why not a boost package for just";
        priceElement.innerHTML = "$ 10";
        lookup_key = "yolo_boost_test";
    } else {
        topicElement.innerHTML = "Choose your package";
        priceElement.innerHTML = "";
    }
}

function premiumPay(){
    formData = {
        lookup_key : lookup_key
    }
    fetch('http://127.0.0.1:5000/collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
               window.location.href = data.url
            } else {
                
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
}

setTopicAndPrice(paymentType);
