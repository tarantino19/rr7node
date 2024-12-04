import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),

	route('/login', 'routes/login.tsx'),
	route('/validate-magic-link', 'routes/validate-magic-link.tsx'),

	route('/discover', 'routes/discover.tsx'),
	route('/app', 'routes/app.tsx', [route('pantry', 'routes/app/pantry.tsx')]),

	route('/settings', 'routes/settings.tsx', [
		route('app2', 'routes/settings/app2.tsx'),
		route('profile', 'routes/settings/profile.tsx'),
	]),
] satisfies RouteConfig;
