import { useMatches } from 'react-router';
import { useMemo } from 'react';

export function useMatchesData(id: string) {
	const matches = useMatches();

	const route = useMemo(() => {
		return matches.find((match) => match.id === id);
	}, [matches, id]);

	return route?.data;
}
