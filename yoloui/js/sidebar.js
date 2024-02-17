// Create a new link element
var linkElement = document.createElement('link');

// Set the attributes for a CSS stylesheet
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';

// Append the link element to the head of the document
document.head.appendChild(linkElement);


setTimeout(function(){closeNav()}, 2000);

function openNav(){
    document.getElementById("sidebar").style.width = "200px";

    document.querySelector(".pop").style.marginLeft = "150px";
    
    setTimeout(function(){closeNav()}, 10000);
}
function closeNav(){
    document.getElementById("sidebar").style.width = "0px";
    document.querySelector(".pop").style.marginLeft = "-30px";
}


//a function to use in any document to copy text of inputField
function copyText() {
    var inputField = document.getElementById("inputField");
    inputField.select();
    inputField.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    inputField.blur();
}

// Corrected import statement

const nav = document.getElementById("sidebar");

fetch('sidebar.html')
    .then(res => res.text()) // Invoke text() to get the text content
    .then(data => {
        nav.innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching sidebar content:', error);
    });
