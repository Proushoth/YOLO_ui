// Check if cookies are set and match expected conditions
if (Cookies.get("userRole") == "user" && Cookies.get("userEmail") != null && Cookies.get("user") != null) {
    // Page loads without any issue
} else if (Cookies.get("userRole") === "creator") {
    window.location.href = "boost.html";
    console.log("bad")
    console.log(Cookies.get("userRole"))
} else {
    window.location.href = "index.html";
}
var input = document.querySelector("#phoneNumber");
var countryCodeInput = document.querySelector("#countryCode");
var phone
var phoneNumber
var countryCode
var otp

// Initialize intlTelInput
var iti = window.intlTelInput(input, {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js",
    initialCountry: "auto",
    separateDialCode: true,
    geoIpLookup: function(callback) {
        // Make an AJAX call to get the user's country code based on their IP
        // Replace this with your actual implementation
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => callback(data.country_code))
            .catch(() => callback(''));
    },
    onSelectCountry: function(countryData) {
        // Update the hidden input field with the selected country code
        countryCodeInput.value = "+" + countryData.dialCode;
    }
});

input.addEventListener('input', function() {
    // Update the hidden input field with the selected country code
    var selectedCountry = iti.getSelectedCountryData();
    countryCodeInput.value = "+" + selectedCountry.dialCode;
});
function updatePhone(){
    countryCode = document.getElementById("countryCode").value;
    phoneNumber = document.getElementById("phoneNumber").value;
    phoneNumber = phoneNumber.trim();
    var repeatedCountryCode = countryCode + countryCode;
    if (phoneNumber.startsWith(repeatedCountryCode)) {
        phoneNumber = phoneNumber.slice(countryCode.length);
    }
    phoneNumber = phoneNumber.replace(/\s/g, '');
    phone = countryCode + phoneNumber;
}
function getOtp() {
    var isConfirmed = confirm("Is this number correct?\n" + phone + "\nOTP will be sent to this number.");
    if (!isConfirmed) {
        return;
    }

    // Disable the button to prevent multiple clicks
    var button = document.getElementById("getOtp");
    button.disabled = true;

    phoneObj = {
        'phone': phone
    };

    fetch('http://127.0.0.1:5000/otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(phoneObj),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("OTP sent! Check your WhatsApp");

                // Show countdown timer
                var count = 60;
                button.innerHTML = "Resend OTP in " + count + "s";

                var countdown = setInterval(function () {
                    count--;
                    button.innerHTML = "Resend OTP in " + count + "s";

                    if (count === 0) {
                        clearInterval(countdown);
                        button.innerHTML = "Get OTP";
                        button.disabled = false;
                    }
                }, 1000);
            } else {
                alert("Something went wrong. Please try again later.");
                button.disabled = false; // Enable the button in case of failure
            }
        })
        .catch(error => {
            alert("Something went wrong. Please try again later.");
            button.disabled = false; // Enable the button in case of failure
        });
}

function setRole(){
    otp = document.getElementById("otp").value
    validateObject = {
        'phone': phone,
        'otp': otp
    }
    fetch('http://127.0.0.1:5000/otp/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validateObject),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("valid OTP")
                //set the user role
                payload = {
                    "userEmail": Cookies.get("userEmail"),
                    "userContactNumber": phone,
                    "userPasswordHash": Cookies.get("userPassword"),
                    "status":"set"
                }
                fetch('http://127.0.0.1:5000/creator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("PORTAL UNLOCKED! WELCOME TO THE REALM OF CREATORS")
                        Cookies.set("userRole", 'creator', { expires: 7 })
                        window.location.href = 'boost.html';
                    } else {
                        console.log(data)
                        alert("Unable to Validate! please contact our team for further help")
                    }
                })
                .catch(error => {
                    alert("Unable to Validate! please contact our team for further help!")
                });
                
            } else {
                alert("invalid OTP for the No. " + phone)
            }
        })
        .catch(error => {
            alert("Something went wrong")
        });

}
