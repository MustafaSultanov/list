export interface User {
	id?: number;
	_id?: number;
	firstName: string;
	lastName: string;
	phone: string;
	gender: string;
	city: string;
	address: string;
	inn: string;
	year?: number; // <- бул жаңы талаа
}
