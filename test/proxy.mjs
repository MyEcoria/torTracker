import request from 'request';

async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    // Define the proxy URL with authentication
    const proxyURL = 'http://arnhfanj-rotate:s63wes3krp6g@p.webshare.io:80/';

    // Set the options for the request
    const requestOptions = {
      url,
      proxy: proxyURL,
      // Provide proxy authentication credentials
      auth: {
        username: 'arnhfanj-rotate',
        password: 's63wes3krp6g'
      }
    };

    // Make the request using the proxy
    request(requestOptions, (error, response, body) => {
      if (error) {
        console.error('Error fetching HTML:', error.message);
        resolve(null);
      } else {
        resolve(body);
      }
    });
  });
}

async function test() {
  const data = await fetchHTML('https://api.myip.com');
  console.log(data);
}

test();