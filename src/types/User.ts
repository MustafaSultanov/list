export interface User extends Record<string, unknown> {
	id?: number;
	_id?: number;
	firstName: string;
	lastName: string;
	phone: string;
	gender: string;
	city: string;
	address: string;
	inn: string;
	year?: number;
}

// Же альтернатива - utility type колдонуу
export type UserData = Omit<User, "id" | "_id"> & {
	id?: number;
	_id?: number;
};
