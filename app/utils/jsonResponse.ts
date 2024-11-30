export function jsonResponse(data: any, init?: ResponseInit) {
	const defaultHeaders = {
		'Content-Type': 'application/json',
		'X-App-Version': '1.0.0', // Default header for all responses
	};

	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			...defaultHeaders,
			...(init?.headers || {}),
		},
	});
}

// Usage for Error
export async function loader() {
	return jsonResponse(
		{ error: 'Resource not found' },
		{
			status: 404,
			headers: {
				'X-Error-Code': 'RESOURCE_NOT_FOUND',
			},
		}
	);
}
