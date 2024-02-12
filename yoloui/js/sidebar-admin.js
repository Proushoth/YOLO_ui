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

const nav = document.getElementById("sidebar");
fetch('sidebar-admin.html')
    .then(res => res.text()) // Invoke text() to get the text content
    .then(data => {
        nav.innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching sidebar content:', error);
    });