import type { Route } from './+types/validate-magic-link';
import { data } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
	return data('ok okay');
};
