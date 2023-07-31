import fetch from 'node-fetch';

const apiUrl = 'https://apibay.org/precompiled/data_top100_recent.json';

function fetchDataAndPerformAction() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Loop through each data item and perform your action
      data.forEach(item => {
        console.log(item.info_hash);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Initial fetch and action
fetchDataAndPerformAction();

// Schedule to fetch and perform action every 15 minutes (900000 milliseconds)
setInterval(fetchDataAndPerformAction, 900000);
