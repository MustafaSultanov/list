/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
// import api from "@/lib/api";
import { Users, FileDown } from "lucide-react";

export default function HomePages() {
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [genderFilter, setGenderFilter] = useState<string>("all");
	const [cityFilter, setCityFilter] = useState<string>("all");
	const [yearFilter, setYearFilter] = useState<string>("all");
	const [letterFilter, setLetterFilter] = useState<string>("all");
	const [loading, setLoading] = useState(true);

	// Кыргыз алфавити
	const alphabet = [
		"А",
		"Б",
		"В",
		"Г",
		"Д",
		"Е",
		"Ё",
		"Ж",
		"З",
		"И",
		"Й",
		"К",
		"Л",
		"М",
		"Н",
		"Ң",
		"О",
		"Ө",
		"П",
		"Р",
		"С",
		"Т",
		"У",
		"Ү",
		"Ф",
		"Х",
		"Ц",
		"Ч",
		"Ш",
		"Щ",
		"Ъ",
		"Ы",
		"Ь",
		"Э",
		"Ю",
		"Я",
	];

	useEffect(() => {
		let isMounted = true;

		const getUsers = async () => {
			try {
				setLoading(true);
				// 🔹 Тышкы API'ге эмес, өзүбүздүн прокси аркылуу чакырабыз
				const res = await fetch("/api/users");
				const data = await res.json();

				if (!isMounted) return;

				let userData = [];
				if (Array.isArray(data)) {
					userData = data;
				} else if (data?.items && Array.isArray(data.items)) {
					userData = data.items;
				} else if (data?.data && Array.isArray(data.data)) {
					userData = data.data;
				}

				console.log("Жүктөлгөн адамдар саны:", userData.length);

				// Convert _id to id and reverse to show newest first
				const mappedUsers = userData
					.map((user: any) => ({
						...user,
						id: user._id || user.id,
					}))
					.reverse();

				if (isMounted) {
					setUsers(mappedUsers);
					setLoading(false);
				}
			} catch (err) {
				console.error("Ката:", err);
				if (isMounted) {
					setUsers([]);
					setLoading(false);
				}
			}
		};

		getUsers();

		return () => {
			isMounted = false;
		};
	}, []);

	const filtered = Array.isArray(users)
		? users.filter((u) => {
				const fullName = `${u.firstName ?? ""} ${
					u.lastName ?? ""
				}`.toLowerCase();
				const phone = (u.phone ?? "").toLowerCase();
				const inn = (u.inn ?? "").toLowerCase();
				const yearStr = (u.year ?? "").toString();
				const searchLower = search.toLowerCase();

				// Толук дал келүү үчүн издөө логикасы
				const matchesSearch =
					fullName.includes(searchLower) ||
					phone.includes(searchLower) ||
					inn.includes(searchLower) ||
					yearStr === searchLower;

				const matchesGender =
					genderFilter === "all" ||
					(u.gender && u.gender.toLowerCase() === genderFilter.toLowerCase());

				const matchesCity =
					cityFilter === "all" ||
					(u.city && u.city.toLowerCase() === cityFilter.toLowerCase());

				const matchesYear = yearFilter === "all" || yearStr === yearFilter;

				// Аты боюнча биринчи тамга (фамилия эмес!)
				const matchesLetter =
					letterFilter === "all" ||
					(u.firstName &&
						u.firstName.trim().toUpperCase().charAt(0) === letterFilter);

				return (
					matchesSearch &&
					matchesGender &&
					matchesCity &&
					matchesYear &&
					matchesLetter
				);
		  })
		: [];

	const maleCount = users.filter(
		(u) => u.gender?.toLowerCase() === "эркек"
	).length;
	const femaleCount = users.filter(
		(u) => u.gender?.toLowerCase() === "аял"
	).length;

	// Уникалдуу шаарлар (прописка) чыгарып алуу
	const cities = Array.from(new Set(users.map((u) => u.city).filter(Boolean)));

	// Уникалдуу жылдар чыгарып алуу
	const years = Array.from(
		new Set(users.map((u) => u.year?.toString()).filter(Boolean))
	).sort((a, b) => Number(b) - Number(a));

	// Ар бир тамга үчүн канча адам бар экенин эсептөө
	const letterCounts = alphabet.map((letter) => ({
		letter,
		count: users.filter(
			(u) =>
				u.firstName && u.firstName.trim().toUpperCase().charAt(0) === letter
		).length,
	}));

	// PDF экспорт функциясы (HTML → PDF ыкма менен)
	const exportToPDF = () => {
		// PDF үчүн HTML түзүү
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			alert("Popup блокировкасын өчүрүңүз!");
			return;
		}

		const currentDate = new Date().toLocaleDateString("ru-RU");

		const htmlContent = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<title>Катталган адамдардын тизмеси</title>
				<style>
					@page { 
						size: A4 landscape; 
						margin: 10mm;
					}
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}
					body {
						font-family: 'Arial', sans-serif;
						font-size: 11pt;
						color: #333;
					}
					.header {
						text-align: center;
						margin-bottom: 15px;
						padding-bottom: 10px;
						border-bottom: 2px solid #1e293b;
					}
					.header h1 {
						font-size: 18pt;
						color: #1e293b;
						margin-bottom: 5px;
					}
					.header .info {
						font-size: 10pt;
						color: #666;
					}
					table {
						width: 100%;
						border-collapse: collapse;
						margin-top: 10px;
					}
					th {
						background-color: #1e293b;
						color: white;
						padding: 10px 8px;
						text-align: left;
						font-weight: bold;
						font-size: 11pt;
						border: 1px solid #1e293b;
					}
					td {
						padding: 8px;
						border: 1px solid #ddd;
						font-size: 10pt;
					}
					tr:nth-child(even) {
						background-color: #f8fafc;
					}
					tr:hover {
						background-color: #e2e8f0;
					}
					.footer {
						margin-top: 15px;
						text-align: center;
						font-size: 9pt;
						color: #666;
					}
					@media print {
						body { 
							print-color-adjust: exact;
							-webkit-print-color-adjust: exact;
						}
					}
				</style>
			</head>
			<body>
				<div class="header">
					<h1>Катталган адамдардын тизмеси</h1>
					<div class="info">
						Басып чыгарылган күнү: ${currentDate} | Бардыгы: ${filtered.length} адам
					</div>
				</div>
				<table>
					<thead>
						<tr>
							<th>Аты</th>
							<th>Фамилия</th>
							<th>Жыл</th>
							<th>Телефон</th>
							<th>Жынысы</th>
							<th>Прописка</th>
							<th>Адрес</th>
						</tr>
					</thead>
					<tbody>
						${filtered
							.map(
								(user) => `
							<tr>
								<td>${user.firstName || ""}</td>
								<td>${user.lastName || ""}</td>
								<td>${user.year || ""}</td>
								<td>${user.phone || ""}</td>
								<td>${user.gender || ""}</td>
								<td>${user.city || ""}</td>
								<td>${user.address || ""}</td>
							</tr>
						`
							)
							.join("")}
					</tbody>
				</table>
				<div class="footer">
					Документ автоматтык түрдө түзүлгөн
				</div>
			</body>
			</html>
		`;

		printWindow.document.write(htmlContent);
		printWindow.document.close();

		// Басып чыгаруу диалогун автоматтык ачуу
		printWindow.onload = () => {
			setTimeout(() => {
				printWindow.print();
			}, 250);
		};
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-gray-100">
			<div className="w-full py-[50px] mx-auto container">
				<div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
					{[
						{
							label: "Бардыгы",
							value: users.length,
							color: "from-blue-500 to-indigo-500",
						},
						{
							label: "Эркектер",
							value: maleCount,
							color: "from-blue-400 to-blue-600",
						},
						{
							label: "Аялдар",
							value: femaleCount,
							color: "from-pink-400 to-pink-600",
						},
					].map((card) => (
						<div
							key={card.label}
							className="bg-slate-800/60 rounded-2xl shadow-lg p-5 border border-slate-700 hover:border-slate-500 transition">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-slate-400 text-sm">{card.label}</p>
									<p className="text-3xl font-bold mt-1 text-white">
										{card.value}
									</p>
								</div>
								<div
									className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
									<Users className="w-6 h-6 text-white" />
								</div>
							</div>
						</div>
					))}

					{/* Gender filter */}
					<div className="bg-slate-800/60 rounded-2xl shadow-lg p-5 border border-slate-700">
						<p className="text-slate-400 text-sm mb-2">Жынысы боюнча</p>
						<select
							value={genderFilter}
							onChange={(e) => setGenderFilter(e.target.value)}
							className="w-full px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
							<option value="all">Бардыгы</option>
							<option value="эркек">Эркектер</option>
							<option value="аял">Аялдар</option>
						</select>
					</div>

					{/* City filter */}
					<div className="bg-slate-800/60 rounded-2xl shadow-lg p-5 border border-slate-700">
						<p className="text-slate-400 text-sm mb-2">Прописка боюнча</p>
						<select
							value={cityFilter}
							onChange={(e) => setCityFilter(e.target.value)}
							className="w-full px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
							<option value="all">Бардыгы</option>
							{cities.map((city) => (
								<option key={city} value={city.toLowerCase()}>
									{city}
								</option>
							))}
						</select>
					</div>

					{/* Year filter */}
					<div className="bg-slate-800/60 rounded-2xl shadow-lg p-5 border border-slate-700">
						<p className="text-slate-400 text-sm mb-2">Жылы боюнча</p>
						<select
							value={yearFilter}
							onChange={(e) => setYearFilter(e.target.value)}
							className="w-full px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
							<option value="all">Бардыгы</option>
							{years.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Алфавиттик навигация */}
				<div className="bg-slate-800/60 rounded-2xl shadow-lg p-4 border border-slate-700 mb-6">
					<p className="text-slate-400 text-sm mb-3">
						Аты боюнча (биринчи тамга):
					</p>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setLetterFilter("all")}
							className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
								letterFilter === "all"
									? "bg-blue-600 text-white shadow-lg"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
							}`}>
							Бардыгы
						</button>
						{letterCounts.map(({ letter, count }) => (
							<button
								key={letter}
								onClick={() => setLetterFilter(letter)}
								disabled={count === 0}
								className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
									letterFilter === letter
										? "bg-blue-600 text-white shadow-lg"
										: count > 0
										? "bg-slate-700 text-slate-300 hover:bg-slate-600"
										: "bg-slate-800 text-slate-600 cursor-not-allowed"
								}`}>
								{letter}
								{/* {count > 0 && (
									<span className="ml-1.5 text-xs opacity-75">({count})</span>
								)} */}
							</button>
						))}
					</div>
				</div>

				<div className="flex md:flex-row items-center justify-between mb-6 gap-4">
					<input
						type="text"
						placeholder="Издөө (аты, телефон, ИНН)..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="px-4 py-3 rounded-2xl border border-slate-600 bg-slate-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
					/>
					<button
						onClick={exportToPDF}
						disabled={filtered.length === 0}
						className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
						<FileDown className="w-5 h-5" />
						PDF кылып сактоо
					</button>
				</div>

				<div className="mb-3 flex gap-1 text-white text-sm">
					Тизме:{" "}
					<span className="font-semibold text-white">{filtered.length}</span>{" "}
					адам
				</div>

				<div className="overflow-x-auto rounded-3xl shadow-xl border border-slate-700 bg-slate-800">
					<table className="min-w-[800px] w-full border-collapse">
						<thead className="bg-[#1e2229]">
							<tr>
								{[
									"Аты",
									"Фамилия",
									"Жыл",
									"Телефон",
									"Жынысы",
									"Прописка",
									"Адрес",
								].map((header) => (
									<th
										key={header}
										className="p-3 text-left text-slate-300 font-semibold text-sm md:text-base whitespace-nowrap">
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-700">
							{loading ? (
								<tr>
									<td colSpan={7} className="p-10 text-center text-gray-400">
										<div className="flex items-center justify-center gap-2">
											<div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
											Жүктөлүүдө...
										</div>
									</td>
								</tr>
							) : filtered.length > 0 ? (
								filtered.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-[#3b404a] transition-all text-sm md:text-base">
										<td className="p-3 text-slate-100 font-medium whitespace-nowrap">
											{user.firstName}
										</td>
										<td className="p-3 text-slate-100 font-medium whitespace-nowrap">
											{user.lastName}
										</td>
										<td className="p-3 text-slate-300 whitespace-nowrap">
											{user.year || "—"}
										</td>
										<td className="p-3 text-slate-300 whitespace-nowrap">
											{user.phone}
										</td>
										<td className="p-3 whitespace-nowrap">
											<span
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
													user.gender?.toLowerCase() === "эркек"
														? "bg-blue-900 text-blue-300"
														: user.gender?.toLowerCase() === "аял"
														? "bg-pink-900 text-pink-300"
														: "bg-gray-700 text-gray-300"
												}`}>
												{user.gender || "—"}
											</span>
										</td>
										<td className="p-3 text-slate-300 whitespace-nowrap">
											{user.city}
										</td>
										<td
											className="p-3 text-slate-300 truncate max-w-[150px]"
											title={user.address}>
											{user.address}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={7} className="p-10 text-center text-gray-500">
										{search ||
										genderFilter !== "all" ||
										cityFilter !== "all" ||
										yearFilter !== "all" ||
										letterFilter !== "all"
											? "Издөө боюнча эч нерсе табылган жок"
											: "Маалымат жок"}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
