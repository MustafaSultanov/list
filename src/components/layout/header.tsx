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

				{/* Desktop menu */}
				<nav className="hidden md:flex items-center gap-8">
					<a className="hover:text-blue-400 transition-colors">Башкы бет</a>
					<a className="hover:text-blue-400 transition-colors">Жөнүндө</a>
					<a className="hover:text-blue-400 transition-colors">Кызматтар</a>
					<a className="hover:text-blue-400 transition-colors">Байланыш</a>
				</nav>

				{/* Burger icon (mobile only) */}
				<button
					onClick={() => setMenuOpen(true)}
					className="md:hidden text-white hover:text-blue-400 transition-colors">
					<Menu size={28} />
				</button>
			</div>

			{/* Mobile menu overlay */}
			{menuOpen && (
				<div className="fixed inset-0 bg-[#0f172a]/95 flex flex-col items-center justify-center gap-8 text-xl text-white z-50 transition-all duration-300">
					<button
						onClick={() => setMenuOpen(false)}
						className="absolute top-5 right-6 text-gray-300 hover:text-blue-400 transition-colors">
						<X size={32} />
					</button>

					<a
						onClick={() => setMenuOpen(false)}
						className="hover:text-blue-400 transition-colors">
						Башкы бет
					</a>
					<a
						onClick={() => setMenuOpen(false)}
						className="hover:text-blue-400 transition-colors">
						Жөнүндө
					</a>
					<a
						onClick={() => setMenuOpen(false)}
						className="hover:text-blue-400 transition-colors">
						Кызматтар
					</a>
					<a
						onClick={() => setMenuOpen(false)}
						className="hover:text-blue-400 transition-colors">
						Байланыш
					</a>
				</div>
			)}
		</header>
	);
}
