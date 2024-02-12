// Check if cookies are set and match expected conditions
if (Cookies.get("userRole") == "creator" && Cookies.get("userEmail") != null && Cookies.get("user") != null) {
    // Page loads without any issue
}else {
    window.location.href = "index.html";
}
function saveDataTest(event){
    event.preventDefault();
    alert("Confirm Request?")
    const formData = {
        "content_type": document.getElementById("content-type").value,
        "content_url": document.getElementById("content-url").value,
        "keywords": document.getElementById("keywords").value.split(",").map(keyword => keyword.trim()),
        "creator_email" : Cookies.get("userEmail")
    };
    console.log(formData)
    // Submit data as JSON POST request
    fetch('http://127.0.0.1:5000/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Data saved! we will reach you soon");
            } else {
                alert("Something went wrong. Please try again later.");
            }
        })
        .catch(error => {
            alert("Something went wrong. Please try again later.");
        });
}
    
function saveData() {
    // Get form data
    
}
