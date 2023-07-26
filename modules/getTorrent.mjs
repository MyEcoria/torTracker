import cheerio from 'cheerio';
import request from 'request';

export async function getTorrentInfo(torrentUrl) {
  function removeTrackersFromMagnet(magnetLink) {
    const url = new URL(magnetLink);
    const trackers = url.searchParams.getAll('tr');
    trackers.forEach((tracker) => url.searchParams.delete('tr'));
    return url.href;
  }

  async function fetchHTML(url) {
    return new Promise((resolve, reject) => {
      // Define the proxy URL with authentication
      const proxyURL = 'http://arnhfanj-rotate:s63wes3krp6g@p.webshare.io:80/';
  
      // Set the options for the request
      const requestOptions = {
        url,
        proxy: proxyURL,
        // Provide proxy authentication credentials
        // auth: {
          // username: 'arnhfanj-rotate',
          // password: 's63wes3krp6g'
        //}
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

  function extractDataFromHTML(html) {
    const $ = cheerio.load(html);
    const magnetLink = $('a[href^="magnet:"]').attr('href');
    const name = $('div.title a').text().trim();
    const image = $('div#torrentsimage img').attr('src');
    const cleanedMagnetLink = magnetLink ? removeTrackersFromMagnet(magnetLink) : null;
    const decodedMagnetLink = cleanedMagnetLink ? decodeURIComponent(cleanedMagnetLink) : null;
    return { magnetLink: decodedMagnetLink, name, image };
  }

  const html = await fetchHTML(torrentUrl);
  if (html) {
    const extractedData = extractDataFromHTML(html);
    return extractedData;
  }
  return null;
}
