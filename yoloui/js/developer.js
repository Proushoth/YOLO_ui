function getApiKey(){
    //at success set the key here
    requestData = {
        email : Cookies.get("userEmail"),
        hash: Cookies.get("userPassword")
    }
    fetch('http://127.0.0.1:5000/developers/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            alert("New API Key Generated, Please Save it!")
            document.getElementById("inputField").value = data.api_key
        })
        .catch(error => {
            console.error('Error excecution', error);
        });
}

function getUsage(){
    var usedQuta
    fetch('http://127.0.0.1:5000/developers/usage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: Cookies.get('userEmail')}),
        })
        .then(response => response.json())
        .then(data => {
            usedQuta = data.request_count
            var data = {
                labels: ["USED", "FREE QUOTA"],
                datasets: [{
                    data: [usedQuta, 100],
                    backgroundColor: ["#FF6384", "#36A2EB"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                }]
            };
            var options = {
                responsive: true
            };
            
            // Get the canvas element
            var canvas = document.getElementById("pieChart");
            
            // Create the pie chart
            var myPieChart = new Chart(canvas, {
                type: 'pie',
                data: data,
                options: options
            });
        })
        .catch(error => {
            console.error('Error excecution', error);
        }); 
}


// Function to toggle the popup display
function togglePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = popup.style.display === "none" ? "block" : "none";
    getUsage()
  }
  
