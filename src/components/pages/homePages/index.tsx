/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
// import api from "@/lib/api";
import { Users } from "lucide-react";

export default function HomePages() {
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [genderFilter, setGenderFilter] = useState<string>("all");
	const [cityFilter, setCityFilter] = useState<string>("all");
	const [loading, setLoading] = useState(true);

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
				const searchLower = search.toLowerCase();

				const matchesSearch =
					fullName.includes(searchLower) ||
					phone.includes(searchLower) ||
					inn.includes(searchLower);

				const matchesGender =
					genderFilter === "all" ||
					(u.gender && u.gender.toLowerCase() === genderFilter.toLowerCase());

				const matchesCity =
					cityFilter === "all" ||
					(u.city && u.city.toLowerCase() === cityFilter.toLowerCase());

				return matchesSearch && matchesGender && matchesCity;
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

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-gray-100">
			<div className="w-full py-[50px] mx-auto container">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
				</div>

				<div className="flex md:flex-row items-center justify-between mb-6 gap-4">
					<input
						type="text"
						placeholder="Издөө (аты, телефон, ИНН)..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="px-4 py-3 rounded-2xl border border-slate-600 bg-slate-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
					/>
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
										{search || genderFilter !== "all" || cityFilter !== "all"
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
