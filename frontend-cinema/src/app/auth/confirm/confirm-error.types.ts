export interface ConfirmEmailError extends Error {
	message: string;
	response: {
		data: {
			message: string;
		};
	};
}
