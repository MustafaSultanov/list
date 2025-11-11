import { User } from "@/types/User";

const API_BASE = "/api/users";

interface ApiResponse {
	[key: string]: unknown;
}

const api = {
	async get(endpoint: string = ""): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			cache: "no-store",
		});
		if (!response.ok) {
			const error = await response.text();
			console.error("GET failed:", error);
			throw new Error(`GET failed: ${response.status}`);
		}
		return response.json();
	},

	async post(endpoint: string, data: Partial<User>): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.text();
			console.error("POST failed:", error);
			throw new Error(`POST failed: ${response.status}`);
		}
		return response.json();
	},

	async patch(endpoint: string, data: Partial<User>): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.text();
			console.error("PATCH failed:", error);
			throw new Error(`PATCH failed: ${response.status}`);
		}
		return response.json();
	},

	async delete(endpoint: string): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			const error = await response.text();
			console.error("DELETE failed:", error);
			throw new Error(`DELETE failed: ${response.status}`);
		}
		return response.json();
	},
};

export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
// });
