import App from '../App'

const index = r => require.ensure([], () => r(require('../views/index/VIndex')), 'index')

export default [{
	path: '/',
	component: App,
	children: [
		{
			path: '',
			redirect: '/index'
		},
		{
			path: '/index',
			component: index,
		},
	]
}]