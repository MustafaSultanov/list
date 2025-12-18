export default function Footer() {
	return (
		<footer className="bg-[#0f1115] text-gray-300 py-6 ">
			<div className="container mx-auto px-6 flex flex-col md:flex-row items-center text-center gap-4">
				<p className="text-sm text-gray-400">
					© {new Date().getFullYear()} Mustafa Sultanov. Бардык укуктар
					корголгон.
				</p>
			</div>
		</footer>
	);
}
