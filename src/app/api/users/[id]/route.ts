import { NextResponse } from "next/server";

const API_BASE = "https://cf0e92d0f8fcab91.mokky.dev/list";

// PATCH - Өзгөртүү үчүн
export async function PATCH(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const body = await request.json();
		const { id } = await context.params;

		console.log("PATCH запрос:", { id, body });

		const response = await fetch(`${API_BASE}/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mokky PATCH ката:", errorText);
			throw new Error(`Өзгөртүүдө ката: ${response.status}`);
		}

		const data = await response.json();
		console.log("PATCH жооп:", data);
		return NextResponse.json(data);
	} catch (error) {
		console.error("PATCH Ката:", error);
		return NextResponse.json(
			{ error: "Өзгөртүү катасы", details: String(error) },
			{ status: 500 }
		);
	}
}

// DELETE - Өчүрүү үчүн
export async function DELETE(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params;

		console.log("DELETE запрос:", { id });

		const response = await fetch(`${API_BASE}/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mokky DELETE ката:", errorText);
			throw new Error(`Өчүрүүдө ката: ${response.status}`);
		}

		console.log("DELETE ийгиликтүү");
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("DELETE Ката:", error);
		return NextResponse.json(
			{ error: "Өчүрүү катасы", details: String(error) },
			{ status: 500 }
		);
	}
}
