import React from 'react';

import Henkou from '../pages/Henkou';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Products from '../pages/Products';
import Users from '../pages/Users';
import Registration from '../pages/Registration';
import Search from '../pages/Search';
import Stop from '../pages/Stop';
import PageNotFound from '../pages/PageNotFound';
import Loginv2 from '../pages/Loginv2';
import SignUp from '../pages/Signup';
import Master from '../pages/master';
import Productsv2 from '../pages/Productsv2';
import Planstatus from '../components/MasterComponents/Planstatus.jsx';
import Assessment from '../components/MasterComponents/Assessment.jsx';
import THaction from '../components/MasterComponents/THActions';
import THAssessment from '../components/MasterComponents/THAssessment';
import PlanType from '../components/MasterComponents/Type';
import Reason from '../components/MasterComponents/Reason';

import { FileSyncOutlined, FileTextOutlined } from '@ant-design/icons';

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
		path: '/master',
		exact: false,
		auth: true,
		routes: [
			{
				path: '/master/products',
				icon: <FileTextOutlined />,
				component: Productsv2,
				name: 'Products'
			},
			{
				path: '/master/planstatus',
				icon: <FileSyncOutlined />,
				component: Planstatus,
				name: 'Plan Status'
			},
			{ path: '/master/assessments', component: Assessment, name: 'Assessments' },
			{ path: '/master/types', component: PlanType, name: 'Henkou Types' },
			{ path: '/master/reasons', component: Reason, name: 'Reasons' },
			{ path: '/master/th/assessments', component: THAssessment, name: 'TH Assessments' },
			{ path: '/master/th/actions', component: THaction, name: 'TH Actions' }
		],
		title: 'Henkou - Product Settings',
		component: Master
	},
	{
		path: '/users',
		exact: true,
		auth: true,
		admin: true,
		title: 'Henkou - Manage Users',
		component: Users
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
