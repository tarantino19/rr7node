import { z } from 'zod';

type FieldErrors = {
	[key: string]: string;
};

//validateForm explanation
//This function takes in a FormData object, a zod schema, a success function, and an error function.
//The function then parses the FormData object using the zod schema.
//If the parse is successful, the success function is called with the parsed data.
//If the parse is not successful, the error function is called with the errors from the parse.
// Always pass 4 arguments to validateForm - formData, zodSchema, successFn (the operation that we want to do), errorFn
export function validateForm<T>(
	formData: FormData,
	zodSchema: z.Schema<T>,
	successFn: (data: T) => unknown,
	errorFn: (errors: FieldErrors) => unknown
) {
	const result = zodSchema.safeParse(Object.fromEntries(formData));

	if (!result.success) {
		const errors: FieldErrors = {};
		result.error.issues.forEach((issue) => {
			const path = issue.path.join('.');
			errors[path] = issue.message;
		});
		return errorFn(errors);
	}

	return successFn(result.data);
}
