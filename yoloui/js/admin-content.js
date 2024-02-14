populateTables();

function populateTables() {
    $.getJSON("http://localhost:5000/creators/requests", function(data) {
        // Clear existing table data
        $("#pendingTable tbody").empty();
        $("#approvedTable tbody").empty();
        $("#rejectedTable tbody").empty();

        // Populate tables with new data
        data.forEach(function(item) {
            var keywords = Array.isArray(item.keywords) && item.keywords.length > 0 ? item.keywords.join(", ") : "No keywords";
            var row = "<tr><td>" + item.content_type + "</td><td>" + item.content_url + "</td><td>" + item.creator_email + "</td><td>" + keywords + "</td><td>" + item.status + "</td>";
            if (item.status === "pending") {
                row += "<td><div class='action'><button onclick='approveRequest(" + JSON.stringify(item) + ")'>Approve</button><button onclick='rejectRequest(" + JSON.stringify(item) + ")'>Reject</button></div></td></tr>";
                $("#pendingTable tbody").append(row);
            } else if (item.status === "approved") {
                $("#approvedTable tbody").append(row + "</tr>");
            } else if (item.status === "rejected") {
                $("#rejectedTable tbody").append(row + "</tr>");
            }
        });

        // Initialize DataTables for each table
        $("#pendingTable").DataTable();
        $("#approvedTable").DataTable();
        $("#rejectedTable").DataTable();
    });
}

// Function to approve a request
function approveRequest(item) {
    var adminId = Cookies.get("admin_id");
    var adminHash = Cookies.get("admin_hash");
    var requestData = {
        "request_id": item.request_id, // Assuming request_id is available in item
        "admin": adminId,
        "hash": adminHash,
        "status": true // true for approved
    };
    console.log(requestData);

    // Send approval status to server
    $.ajax({
        url: "http://localhost:5000/creators/requests/validate",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(response) {
            // Handle success response from server
            alert("Request approved successfully:", response);
            // Call populateTables function to refresh data
            populateTables();
        },
        error: function(xhr, status, error) {
            // Handle error response from server
            alert("Error approving request:", error);
            // Optionally, show error message or perform other actions on error
        }
    });
}

// Function to reject a request
function rejectRequest(item) {
    var adminId = Cookies.get("admin_id");
    var adminHash = Cookies.get("admin_hash");
    var requestData = {
        "request_id": item.request_id, // Assuming request_id is available in item
        "admin": adminId,
        "hash": adminHash,
        "status": false // false for rejected
    };

    // Send rejection status to server
    $.ajax({
        url: "http://localhost:5000/creators/requests/validate",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(response) {
            // Handle success response from server
            alert("Request rejected successfully:", response);
            // Call populateTables function to refresh data
            populateTables();
        },
        error: function(xhr, status, error) {
            // Handle error response from server
            alert("Error rejecting request:", error);
            // Optionally, show error message or perform other actions on error
        }
    });
}