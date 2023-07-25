import axios from 'axios';
import cheerio from 'cheerio';

export async function getTorrentInfo(torrentUrl) {
  function removeTrackersFromMagnet(magnetLink) {
    const url = new URL(magnetLink);
    const trackers = url.searchParams.getAll('tr');
    trackers.forEach((tracker) => url.searchParams.delete('tr'));
    return url.href;
  }

  async function fetchHTML(url) {
    try {
      // Use the http.Agent to set the proxy for the request
      const httpAgent = new http.Agent({ proxy: { host: 'p.webshare.io', port: 80 } });
      
      // Set the proxy and auth in the config object
      const response = await axios.get(url, {
        proxy: { host: 'p.webshare.io', port: 80 },
        auth: {
          username: 'arnhfanj-rotate',
          password: 's63wes3krp6g'
        },
        httpAgent: httpAgent
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching HTML:', error.message);
      return null;
    }
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
