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

setTopicAndPrice(paymentType);
