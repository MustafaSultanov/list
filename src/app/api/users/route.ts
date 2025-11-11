import { NextResponse } from "next/server";

const API_BASE = "https://cf0e92d0f8fcab91.mokky.dev/list";

// GET - Бардык маалыматтарды алуу (limit=500 менен)
export async function GET() {
	try {
		const response = await fetch(`${API_BASE}?limit=500`, {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Маалымат жүктөлгөн жок");
		}

		const data = await response.json();
		console.log("GET жооп:", data);
		return NextResponse.json(data);
	} catch (error) {
		console.error("GET Ката:", error);
		return NextResponse.json(
			{ error: "Маалымат алуу катасы" },
			{ status: 500 }
		);
	}
}

// POST - Жаңы колдонуучу кошуу
export async function POST(request: Request) {
	try {
		const body = await request.json();

		console.log("POST запрос:", body);

		const response = await fetch(API_BASE, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mokky POST ката:", errorText);
			throw new Error(`Сактоодо ката: ${response.status}`);
		}

		const data = await response.json();
		console.log("POST жооп:", data);
		return NextResponse.json(data);
	} catch (error) {
		console.error("POST Ката:", error);
		return NextResponse.json(
			{ error: "Кошуу катасы", details: String(error) },
			{ status: 500 }
		);
	}
}
