import axios from 'axios';
const access_token = localStorage.getItem('access_token');
axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
	axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
	console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

class Http {
	 prefix = 'api/';
	 read(url, params = null) {
         this.prefix
		return axios.get(this.prefix + url, {
			params: params
		});
	}
	create() {}
	put() {}
	patch() {}
    delete()
}

class Basic extends Http{
    trial(){

    }
}

export default axios;
