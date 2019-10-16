'use strict'

const tempUrl = 'https://api.nps.gov/api/v1/parks'

const apiKey = 'bLY38z3SfgYyjonYiWLiCcZC65vR9zEQonTSdN9z'


function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
    console.log(responseJson.data.length);
    console.log(responseJson);


    if( !$('body').hasClass('grey-style') ){
      $('body').addClass('grey-style');
    }

    //to make sure the result is meets the max amount and the amount of data given
    for (let i = 0; i < responseJson.data.length && i < maxResults; i++) {
        $('.results-list').append(`
        <li>
          <h3> 
            <a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a>
          </h3>
          <p>${responseJson.data[i].description}</p>

        </li>`);
    }

    $('.results').removeClass('hidden');
}

function getParks(state, maxResults) {
    $('.js-error-message').empty();
    $('.results-list').empty();
    
    if(maxResults<=0 || maxResults > 100){
      console.log(' invalid ')
        $('.js-error-message').text(`Invalid Entry: enter between 1 and 100.`);
        return;
    }
    
    const params = {
        stateCode: state,
        limit: maxResults
    }
    
    const query = formatQueryParams(params);
    const url = tempUrl + '?' + query + '&api_key=' + apiKey;
    
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
        $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    $('.js-form').on('submit', function() {
        event.preventDefault();

        let state = $('#js-search-term').val().split(",");
        let maxResults = $('#js-max-results').val();
        getParks(state, maxResults);
    })
}

$(watchForm);