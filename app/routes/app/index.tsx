import { LoaderFunction, redirect } from 'react-router';

export const loader: LoaderFunction = async () => {
	return redirect('/app/recipes');
};

export default function Index() {
	return null;
}
