"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-4 shadow-md fixed top-0 left-0 w-full z-50">
			<div className="container mx-auto flex items-center justify-between px-6">
				<Link
					href="/"
					className="text-2xl font-semibold tracking-wide hover:text-blue-400 transition-colors duration-300">
					SULTANOV
				</Link>
			</div>
		</header>
	);
}
