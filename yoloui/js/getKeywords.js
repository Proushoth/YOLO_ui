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
        }else if(materialType == "song" || materialType == "video"){
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
    process("load")
    // Sample JSON object for the request
    const sampleRequest = {
        keywords: Cookies.get('keywords'),
        media_type: materialType
    };

    // Convert the sample request to a query string with custom encoding
    const queryString = Object.keys(sampleRequest)
        .map(key => `${customEncodeURIComponent(key)}=${customEncodeURIComponent(sampleRequest[key])}`)
        .join('&');
    const fetch_url = `http://localhost:5000/songs?${queryString}`    

    // Make the API call to http://localhost:5000/songs
    fetch(fetch_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        process("stop")
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
        console.log(fetch_url)
        const showArea = document.querySelector(".show-area");
    showArea.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        // Extract data from the current object
        const currentObject = data[i];
        const videoId = currentObject.video_url.split('v=')[1];
        const posterPath = currentObject.thumbnail;
        const title = currentObject.title;
        const releaseDate = currentObject.publishDate;
        const video_url = currentObject.video_url;
    
        // Create anchor tag with movie data as parameters
        const newAnchor = document.createElement('a');
    
        // Create div with class name "gig"
        const gigDiv = document.createElement('div');
        gigDiv.className = 'gig';
    
        // Create div with class name "poster" and img element
        const posterDiv = document.createElement('div');
        posterDiv.className = 'poster';
        const posterImg = document.createElement('img');
        posterImg.src = posterPath;
        posterImg.alt = '';
    
        // Append img to posterDiv
        posterDiv.appendChild(posterImg);
    
        // Create div with class name "title" and set text content
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = title;
    
        // Append posterDiv and titleDiv to gigDiv
        gigDiv.appendChild(posterDiv);
        gigDiv.appendChild(titleDiv);
    
        // Append gigDiv to newAnchor
        newAnchor.appendChild(gigDiv);

        // Add click event listener to each anchor
        newAnchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            // Create popup div
            const popupDiv = document.createElement('div');
            popupDiv.className = 'popup';

            // Set popup content with movie details
            popupDiv.innerHTML = `
                <h2>${title}</h2>
                <div class="img-wrap">
                <iframe style="width: 100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p>Release Date: ${releaseDate}</p>
                <!-- Add other details as needed -->
                <a href="${video_url}" target="_blank">Go To YouTube</a>
                <button id="closeBtn">Close</button>
            `;

            // Append popup div to body
            document.body.appendChild(popupDiv);

            // Add event listener to close button
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(popupDiv); // Remove popup div from body
            });

            
        });
    
        
        showArea.appendChild(newAnchor);
    }

    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });
}
function getBooks(){
    process("load")
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
        process("stop")
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
        // Console log the response
        console.log(data);
        const showArea = document.querySelector(".show-area");
        showArea.innerHTML = '';
        for (let i = 0; i < data.length; i++) {

            // Extract data from the current object
            const currentObject = data[i];

            const posterPath = currentObject.thumbnail;
            const title = currentObject.title;
            const description1 = currentObject.description;
            const description2 = currentObject.textSnippet;
            const lang = currentObject.language;
            const maturity = currentObject.maturity;
            const releaseDate = currentObject.publishDate;
            const content_url = currentObject.contentUrl;
        
            // Create anchor tag with movie data as parameters
            const newAnchor = document.createElement('a');
        
            // Create div with class name "gig"
            const gigDiv = document.createElement('div');
            gigDiv.className = 'gig';
        
            // Create div with class name "poster" and img element
            const posterDiv = document.createElement('div');
            posterDiv.className = 'poster';
            const posterImg = document.createElement('img');
            posterImg.src = posterPath;
            posterImg.alt = '';
        
            // Append img to posterDiv
            posterDiv.appendChild(posterImg);
        
            // Create div with class name "title" and set text content
            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
            titleDiv.textContent = title;
        
            // Append posterDiv and titleDiv to gigDiv
            gigDiv.appendChild(posterDiv);
            gigDiv.appendChild(titleDiv);
        
            // Append gigDiv to newAnchor
            newAnchor.appendChild(gigDiv);

            // Add click event listener to each anchor
            newAnchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            // Create popup div
            const popupDiv = document.createElement('div');

            popupDiv.className = 'popup';

            // Set popup content with movie details
            popupDiv.innerHTML = `
                <h2>${title}</h2>
                <div class="img-wrap">
                    <img src="${posterPath}">
                </div>
                <p>${description1}</p>
                <p>${description2}</p>
                <p>Release Date: ${releaseDate}</p>
                <p>Maturity: ${maturity}</p>
                <p>Language: ${lang}</p>
                <!-- Add other details as needed -->
                <a href="${content_url}" target="_blank">Browse for free sources</a>
                <button id="closeBtn">Close</button>
            `;

            // Append popup div to body
            document.body.appendChild(popupDiv);

            // Add event listener to close button
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(popupDiv); // Remove popup div from body
            });

                
            });
        
            
            showArea.appendChild(newAnchor);
        }

    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });

    
}
function getAnime(){
    process("load")
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
        process("stop")
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
        //do the data presentation here
        // Append newAnchor to showArea
    const showArea = document.querySelector(".show-area");
    showArea.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        // Extract data from the current object
        const currentObject = data[i];

        const genres = currentObject.genres;
        const episodes_count = currentObject.episodes_count;
        const description = currentObject.synopsis;
        const content_url = currentObject.moreinfo_url;
        const producersArray = currentObject.producers;
        const posterPath = currentObject.thumbnail;
        const jtitle = currentObject.japanese_title;
        const title = currentObject.title;
        const releaseDate = currentObject.release_year;
        const rating = currentObject.rating;
        const themes = currentObject.themes;
    
        // Create anchor tag with movie data as parameters
        const newAnchor = document.createElement('a');
    
        // Create div with class name "gig"
        const gigDiv = document.createElement('div');
        gigDiv.className = 'gig';
    
        // Create div with class name "poster" and img element
        const posterDiv = document.createElement('div');
        posterDiv.className = 'poster';
        const posterImg = document.createElement('img');
        posterImg.src = posterPath;
        posterImg.alt = '';
    
        // Append img to posterDiv
        posterDiv.appendChild(posterImg);
    
        // Create div with class name "title" and set text content
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = title;
    
        // Append posterDiv and titleDiv to gigDiv
        gigDiv.appendChild(posterDiv);
        gigDiv.appendChild(titleDiv);
    
        // Append gigDiv to newAnchor
        newAnchor.appendChild(gigDiv);

        // Add click event listener to each anchor
        newAnchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            // Create popup div
            const popupDiv = document.createElement('div');
            popupDiv.className = 'popup';

            // Set popup content with movie details
            popupDiv.innerHTML = `
                <h2>${title}</h2>
                <div class="img-wrap">
                    <img src="${posterPath}">
                </div>
                <p>${jtitle}</p>
                <p>${description}</p>
                <p>Release Date: ${releaseDate}</p>
                <p>Genres: ${genres.join(', ')}</p>
                <p>Producers: ${producersArray.join(', ')}</p>
                <p>Rating: ${rating}</p>
                <p>Themes: ${themes}</p>
                <p>Episodes Count: ${episodes_count}</p>
                <!-- Add other details as needed -->
                <a href="${content_url}" target="_blank">Browse for free sources</a>
                <button id="closeBtn">Close</button>
            `;

            // Append popup div to body
            document.body.appendChild(popupDiv);

            // Add event listener to close button
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(popupDiv); // Remove popup div from body
            });

            
        });
    
        
        showArea.appendChild(newAnchor);
    }
    // Add event listener to close popup div when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === popupDiv) {
            document.body.removeChild(popupDiv); // Remove popup div from body
        }
    });
    })
    .catch(error => {
        console.error('An unexpected error occurred:', error);
    });

}



function getMoviesOrTvs(){
    process("load");
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
    process("stop");    
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
    // Append newAnchor to showArea
    const showArea = document.querySelector(".show-area");
    showArea.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        // Extract data from the current object
        const currentObject = data[i];
        const backdropPath = currentObject.backdrop_path;
        const genres = currentObject.genres;
        const id = currentObject.id;
        const originalLanguage = currentObject.original_language;
        const overview = currentObject.overview;
        const popularity = currentObject.popularity;
        const posterPath = currentObject.poster_path;
        const title = currentObject.title || currentObject.name || currentObject.original_name;
        const releaseDate = currentObject.release_date || currentObject.first_air_date || "";
        const voteAverage = currentObject.vote_average;
        const voteCount = currentObject.vote_count;
    
        // Create anchor tag with movie data as parameters
        const newAnchor = document.createElement('a');
        newAnchor.href = `detail.html?id=${id}&title=${encodeURIComponent(title)}&backdropPath=${encodeURIComponent(backdropPath)}&genres=${encodeURIComponent(JSON.stringify(genres))}&originalLanguage=${originalLanguage}&overview=${encodeURIComponent(overview)}&popularity=${popularity}&posterPath=${encodeURIComponent(posterPath)}&releaseDate=${releaseDate}&voteAverage=${voteAverage}&voteCount=${voteCount}`;
    
        // Create div with class name "gig"
        const gigDiv = document.createElement('div');
        gigDiv.className = 'gig';
    
        // Create div with class name "poster" and img element
        const posterDiv = document.createElement('div');
        posterDiv.className = 'poster';
        const posterImg = document.createElement('img');
        posterImg.src = posterPath;
        posterImg.alt = '';
    
        // Append img to posterDiv
        posterDiv.appendChild(posterImg);
    
        // Create div with class name "title" and set text content
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.textContent = title;
    
        // Append posterDiv and titleDiv to gigDiv
        gigDiv.appendChild(posterDiv);
        gigDiv.appendChild(titleDiv);
    
        // Append gigDiv to newAnchor
        newAnchor.appendChild(gigDiv);

        // Add click event listener to each anchor
        newAnchor.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            // Create popup div
            const popupDiv = document.createElement('div');
            popupDiv.className = 'popup';

            // Set popup content with movie details
            popupDiv.innerHTML = `
                <h2>${title}</h2>
                <div class="img-wrap">
                    <img src="${posterPath}">
                </div>
                <p>${overview}</p>
                <p>Release Date: ${releaseDate}</p>
                <p>Genres: ${genres.join(', ')}</p>
                <p>Popularity: ${popularity}</p>
                <p>Vote Average: ${voteAverage}</p>
                <p>Vote Count: ${voteCount}</p>
                <!-- Add other details as needed -->
                <a href="https://movie-web.app/media/tmdb-${materialType}-${id}-${title}" target="_blank">Browse for free sources</a>
                <button id="closeBtn">Close</button>
            `;

            // Append popup div to body
            document.body.appendChild(popupDiv);

            // Add event listener to close button
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(popupDiv); // Remove popup div from body
            });

            
        });
    
        
        showArea.appendChild(newAnchor);
    }
    // Add event listener to close popup div when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === popupDiv) {
            document.body.removeChild(popupDiv); // Remove popup div from body
        }
    });
    })
    .catch(error => {
    console.error('An unexpected error occurred:', error);
    });
}
function process(process){
    if (process == "load"){
        document.querySelector('.load').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
    }else if(process == "stop"){
        document.querySelector('.load').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}
function customEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/%2C/g, ',');
}
