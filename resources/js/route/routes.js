import Henkou from '../pages/Henkou';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import Search from '../pages/Search';
import Stop from '../pages/Stop';
import PageNotFound from '../pages/PageNotFound';
import Loginv2 from '../pages/Loginv2';
import SignUp from '../pages/Signup';

const routes = [
	{
		path: '/henkou',
		exact: true,
		auth: true,
		title: 'Henkou',
		component: Henkou
	},
	{
		path: '/',
		exact: true,
		auth: true,
		title: 'Henkou - Home Page',
		component: Home,
		fallback: Loginv2
	},
	{
		path: '/signup',
		exact: true,
		auth: false,
		title: 'Henkou - Sign Up',
		component: SignUp
	},
	{
		path: '/login',
		exact: true,
		auth: false,
		title: 'Henkou - Login',
		component: Loginv2
	},
	{
		path: '/registration',
		exact: true,
		auth: true,
		title: 'Henkou - Registration',
		component: Registration
	},
	{
		path: '/search',
		exact: true,
		auth: true,
		title: 'Henkou - Search Plans',
		component: Search
	},
	{
		path: '/stop',
		exact: true,
		auth: true,
		title: 'Henkou - Stop Plans',
		component: Stop
	},
	{
		path: '',
		exact: false,
		auth: false,
		title: '404 Page not found!',
		component: PageNotFound
	}
];

export default routes;
