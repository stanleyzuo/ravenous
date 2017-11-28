const clientId = 'IMw0IBVkVQyGWWjaHKrMxg';
const secret = 'fbmNrOPWFYDwOXxJXvq4OjQSJrz7h5l5bmnrPCottACcepUCK3NY04gflN7ZzO6g';
let accessToken;

const Yelp = {
	getAccessToken() {
		if (accessToken) {
			return new Promise(resolve => resolve(accessToken));
		}
		return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`, {
			method:'POST'
		}).then(response => {
				return response.json();
			}).then(jsonResponse => {
				accessToken = jsonResponse.access_token;
			});
		},

	search(term, location, sortBy) {
		return Yelp.getAccessToken().then(() => {
			return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,{
				headers: {
					Authorization:`Bearer ${accessToken}`
				}
			});
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			if (jsonResponse.businesses) {
				return jsonResponse.businesses.map(business => {
					return {
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories.title,
            rating: business.rating,
            reviewCount: business.review_count,
            url: business.url
          }
        });
			}
		});
	}
};

export default Yelp;