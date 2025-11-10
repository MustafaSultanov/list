import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch(
			"https://cf0e92d0f8fcab91.mokky.dev/list?limit=500",
			{
				cache: "no-store",
			}
		);

		if (!response.ok) {
			throw new Error("Маалымат жүктөлгөн жок");
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Ката:", error);
		return NextResponse.json(
			{ error: "Маалымат алуу катасы" },
			{ status: 500 }
		);
	}
}
