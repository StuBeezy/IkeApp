const axios = require('axios');


class FlickrAPI {
    constructor() {
        this.baseURL = 'https://www.flickr.com/services/rest/';
        this.apiKey = ''; // Insert your own Flickr API key here before running.
        this.method = 'flickr.photos.search';
        this.format = 'json';
    }
    async getPhotos(tags, size) {
        let params = {
            api_key: this.apiKey,
            method: this.method,
            per_page: 10,
            page: 1,
            tags: tags,
            format: this.format,
            nojsoncallback: 1
        };
        if (size === 'o') {
            params.extras = 'original_format';
        }
        try {
            return await axios.get(this.baseURL, {
                params
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = FlickrAPI;
