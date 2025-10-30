export default function Footer() {
	return (
		<footer className="bg-[#0f1115] text-gray-300 py-6 ">
			<div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
				<h2 className="text-lg font-semibold text-white">Sultanov</h2>
				<p className="text-sm text-gray-400">
					© {new Date().getFullYear()} MyBrand. Бардык укуктар корголгон.
				</p>
				<div className="flex gap-4">
					<a className="hover:text-blue-400 transition-colors duration-300">
						Facebook
					</a>
					<a className="hover:text-blue-400 transition-colors duration-300">
						Instagram
					</a>
					<a className="hover:text-blue-400 transition-colors duration-300">
						LinkedIn
					</a>
				</div>
			</div>
		</footer>
	);
}
