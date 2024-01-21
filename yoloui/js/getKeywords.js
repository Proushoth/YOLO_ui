var materialType
function getKeys() {
    var promptText = document.getElementById("prompt-text").value;
    materialType = document.getElementById("materialType").value;

    // Make an API call to http://localhost:5000/keywords
    fetch(`http://localhost:5000/keywords?prompt=${encodeURIComponent(promptText)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the request was successful (status code 200)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then(keywords => {


        // Clear all cookies
        Cookies.remove('keywords');

        // Store the updated keywords in the cookie
        Cookies.set('keywords', keywords, { expires: 365 });

        console.log(keywords);

        if(materialType == "movie" || materialType == "tv"){
            getMoviesOrTvs()
        }else if(materialType == "songs" || materialType == "video"){
            getSongsOrVideos()
        }else if(materialType == "books"){
            getBooks()
        }else if(materialType == "anime-movie" || materialType == "anime-tv"){
            getAnime()
        }else{
            alert("material type not valid")
        }


    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });
}

function readKeywords(){
    console.log(Cookies.get('keywords'));
    console.log(materialType)
}

//get all the materilas to show case in the show area
function getSongsOrVideos(){
    // Sample JSON object for the request
    const sampleRequest = {
        keywords: Cookies.get('keywords'),
        media_type: materialType
    };

    // Convert the sample request to a query string
    const queryString = Object.keys(sampleRequest)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sampleRequest[key])}`)
        .join('&');

    // Make the API call to http://localhost:5000/songs
    fetch(`http://localhost:5000/songs?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the request was successful (status code 200)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then(data => {
        // Console log the response
        console.log(data);
    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });
}
function getBooks(){
    // Sample JSON object for the request
    const sampleRequest = {
        keywords: Cookies.get('keywords')
    };

    // Convert the sample request to a query string
    const queryString = Object.keys(sampleRequest)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sampleRequest[key])}`)
        .join('&');

    // Make the API call to http://localhost:5000/books
    fetch(`http://localhost:5000/books?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the request was successful (status code 200)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then(data => {
        // Console log the response
        console.log(data);
    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });

    
}
function getAnime(){
    var md_type
    if (materialType == "anime-movie"){
        md_type = "movie"
    }else if(materialType == "anime-tv"){
        md_type = "tv"
    }

    // Sample JSON object for the request
    const sampleRequest = {
        keywords: Cookies.get('keywords'),
        media_type: md_type
    };

    // Convert the sample request to a query string
    const queryString = Object.keys(sampleRequest)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sampleRequest[key])}`)
        .join('&');

    // Make the API call to http://localhost:5000/anime
    fetch(`http://localhost:5000/anime?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the request was successful (status code 200)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then(data => {
        // Console log the response
        console.log(data);
    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });

}



function getMoviesOrTvs(){
    // Sample JSON object for the request
    const sampleRequest = {
    keywords: Cookies.get('keywords'),
    media_type: materialType
    };

    // Convert the sample request to a query string
    const queryString = Object.keys(sampleRequest)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sampleRequest[key])}`)
    .join('&');

    // Make the API call to http://localhost:5000/movies
    fetch(`http://localhost:5000/movies?${queryString}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .then(response => {
    // Check if the request was successful (status code 200)
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    })
    .then(data => {
    // Console log the response
    console.log(data);
    })
    .catch(error => {
    console.error('An unexpected error occurred:', error);
    });
}