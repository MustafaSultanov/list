"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types/User";
import {
	Plus,
	Pencil,
	Trash2,
	X,
	Check,
	AlertCircle,
	AlertTriangle,
	Users,
} from "lucide-react";

export default function Admin() {
	const [users, setUsers] = useState<User[]>([]);
	const [form, setForm] = useState<User>({
		firstName: "",
		lastName: "",
		phone: "",
		gender: "",
		city: "",
		address: "",
		inn: "",
		year: new Date().getFullYear(),
	});
	const [editingId, setEditingId] = useState<number | null>(null);
	const [search, setSearch] = useState("");
	const [genderFilter, setGenderFilter] = useState<string>("all");
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch("/api/users");
			const data = await res.json();

			let userData = [];
			if (Array.isArray(data)) {
				userData = data;
			} else if (data?.items && Array.isArray(data.items)) {
				userData = data.items;
			} else if (data?.data && Array.isArray(data.data)) {
				userData = data.data;
			}

			// Convert _id to id and reverse to show newest first
			const mappedUsers = userData
				.map((user: { _id: number; id: number }) => ({
					...user,
					id: user._id || user.id,
				}))
				.reverse();

			setUsers(mappedUsers);
		} catch (error) {
			console.error("Fetch error:", error);
			setError("Маалыматтарды жүктөөдө ката кетти");
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			setError(null);

			if (editingId) {
				await api.patch(`/${editingId}`, form);
			} else {
				await api.post("", form);
			}

			setForm({
				firstName: "",
				lastName: "",
				phone: "",
				gender: "",
				city: "",
				address: "",
				inn: "",
			});
			setEditingId(null);
			setModalOpen(false);
			await fetchUsers();
		} catch (error) {
			console.error("Submit error:", error);
			setError("Сактоодо ката кетти");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (user: User) => {
		if (!user.id) {
			setError("ID жок - өзгөртүү мүмкүн эмес");
			return;
		}
		setForm({
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			phone: user.phone || "",
			gender: user.gender || "",
			city: user.city || "",
			address: user.address || "",
			inn: user.inn || "",
		});
		setEditingId(user.id);
		setModalOpen(true);
		setError(null);
	};

	const openDeleteModal = (user: User) => {
		if (!user.id) {
			setError("ID жок - өчүрүү мүмкүн эмес");
			return;
		}
		setUserToDelete(user);
		setDeleteModalOpen(true);
	};

	const handleDelete = async () => {
		if (!userToDelete?.id) {
			setError("ID жок - өчүрүү мүмкүн эмес");
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await api.delete(`/${userToDelete.id}`);
			setDeleteModalOpen(false);
			setUserToDelete(null);
			await fetchUsers();
		} catch (error) {
			console.error("Delete error:", error);
			setError("Өчүрүүдө ката кетти");
		} finally {
			setLoading(false);
		}
	};

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

				return matchesSearch && matchesGender;
		  })
		: [];

	// Calculate gender statistics
	const maleCount = users.filter(
		(u) => u.gender?.toLowerCase() === "эркек"
	).length;

	const femaleCount = users.filter(
		(u) => u.gender?.toLowerCase() === "аял"
	).length;

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-100 p-6">
			<div className="w-full py-[50px] mx-auto container">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

					<div className="bg-slate-800/60 rounded-2xl shadow-lg p-5 border border-slate-700">
						<p className="text-slate-400 text-sm mb-2">Фильтр</p>
						<select
							value={genderFilter}
							onChange={(e) => setGenderFilter(e.target.value)}
							className="w-full px-3 py-2 rounded-xl border border-slate-600 bg-slate-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
							<option value="all">Бардыгы</option>
							<option value="Эркек">Эркектер</option>
							<option value="Аял">Аялдар</option>
						</select>
					</div>
				</div>

				<div className="flex flex-col mx-auto my-[10px] md:flex-row gap-4 w-full md:w-auto">
					<input
						type="text"
						placeholder="Издөө (аты, телефон, ИНН)..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="px-4 py-3 rounded-2xl border border-slate-600 bg-slate-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
					/>
					<button
						onClick={() => {
							setForm({
								firstName: "",
								lastName: "",
								phone: "",
								gender: "",
								city: "",
								address: "",
								inn: "",
							});
							setEditingId(null);
							setModalOpen(true);
						}}
						className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap">
						<Plus className="w-5 h-5" />
						Кошуу
					</button>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
						<AlertCircle className="w-5 h-5 " />
						<span>{error}</span>
						<button
							onClick={() => setError(null)}
							className="ml-auto text-red-500 hover:text-red-700">
							<X className="w-5 h-5" />
						</button>
					</div>
				)}

				<div className="mb-3 flex gap-1 text-white text-sm">
					Тизме:
					<span className="font-semibold text-white">
						{filtered.length}
					</span>{" "}
					адам
				</div>

				<div className="overflow-x-auto rounded-3xl shadow-xl border border-slate-700 bg-slate-800">
					<table className="w-full border-collapse">
						<thead className="bg-slate-900/70">
							<tr>
								{[
									"Аты",
									"Фамилия",
									"Жыл",
									"Телефон",
									"Жынысы",
									"Прописка",
									"Адрес",
									"ИНН",
									"",
								].map((h) => (
									<th
										key={h}
										className="p-4 text-left text-slate-300 font-semibold text-sm">
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-700">
							{filtered.length ? (
								filtered.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-slate-700/50 transition-all">
										<td className="p-4 text-white">{user.firstName}</td>
										<td className="p-4 text-white">{user.lastName}</td>
										<td className="p-4 text-slate-300">{user.year || "—"}</td>
										<td className="p-4 text-slate-300">{user.phone}</td>
										<td className="p-4">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
													user.gender?.toLowerCase() === "Эркек"
														? "bg-blue-900/40 text-blue-300"
														: user.gender?.toLowerCase() === "Аял"
														? "bg-pink-900/40 text-pink-300"
														: "bg-slate-700 text-slate-300"
												}`}>
												{user.gender || "—"}
											</span>
										</td>
										<td className="p-4 text-slate-300">{user.city}</td>
										<td
											className="p-4 text-slate-300 truncate max-w-[150px]"
											title={user.address}>
											{user.address}
										</td>
										<td className="p-4 text-slate-400 font-mono">{user.inn}</td>
										<td className="p-4 text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleEdit(user)}
													className="px-3 py-2 bg-yellow-600/70 hover:bg-yellow-600 text-white rounded-xl text-sm transition">
													<Pencil className="w-4 h-4 inline-block mr-1" />
													Өзгөртүү
												</button>
												<button
													onClick={() => openDeleteModal(user)}
													className="px-3 py-2 bg-red-600/70 hover:bg-red-600 text-white rounded-xl text-sm transition">
													<Trash2 className="w-4 h-4 inline-block mr-1" />
													Өчүрүү
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={9}
										className="p-10 text-center text-slate-500 text-sm">
										Маалымат жок
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Edit/Add Modal */}
				{modalOpen && (
					<div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative">
							<button
								onClick={() => !loading && setModalOpen(false)}
								disabled={loading}
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50">
								<X className="w-6 h-6" />
							</button>
							<h2 className="text-2xl font-bold mb-6 text-slate-800">
								{editingId ? "Маалыматты өзгөртүү" : "Жаңы колдонуучу кошуу"}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input
									name="firstName"
									value={form.firstName}
									onChange={handleChange}
									placeholder="Аты *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
								<input
									name="lastName"
									value={form.lastName}
									onChange={handleChange}
									placeholder="Фамилия *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
								<input
									type="number"
									name="year"
									value={form.year || ""}
									onChange={handleChange}
									placeholder="Жыл *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>

								<input
									name="phone"
									value={form.phone}
									onChange={handleChange}
									placeholder="Телефон *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
								<select
									name="gender"
									value={form.gender}
									onChange={handleChange}
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 bg-white"
									disabled={loading}>
									<option value="">Пол *</option>
									<option value="Эркек">Эркек</option>
									<option value="Аял">Аял</option>
								</select>
								<input
									name="city"
									value={form.city}
									onChange={handleChange}
									placeholder="Шаар *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
								<input
									name="inn"
									value={form.inn}
									onChange={handleChange}
									placeholder="ИНН *"
									className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
								<input
									name="address"
									value={form.address}
									onChange={handleChange}
									placeholder="Адрес *"
									className="col-span-1 md:col-span-2 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
									disabled={loading}
								/>
							</div>
							<div className="flex justify-end gap-3 mt-6">
								<button
									onClick={() => setModalOpen(false)}
									disabled={loading}
									className="flex items-center gap-2 px-6 py-3 bg-gray-400 rounded-xl text-white hover:bg-gray-500 transition shadow-md hover:shadow-lg disabled:opacity-50">
									<X className="w-5 h-5" />
									Жабуу
								</button>
								<button
									onClick={handleSubmit}
									disabled={
										loading || !form.firstName || !form.lastName || !form.gender
									}
									className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
									{loading ? (
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									) : (
										<Check className="w-5 h-5" />
									)}
									{editingId ? "Сактоо" : "Кошуу"}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{deleteModalOpen && userToDelete && (
					<div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
									<AlertTriangle className="w-8 h-8 text-red-600" />
								</div>
								<h2 className="text-2xl font-bold mb-3 text-slate-800">
									Вы точно хотите удалить?
								</h2>
								<p className="text-slate-600 mb-2">
									<span className="font-semibold">
										{userToDelete.firstName} {userToDelete.lastName}
									</span>
								</p>
								<p className="text-slate-500 text-sm mb-6">
									Бул аракетти кайтаруу мүмкүн эмес
								</p>
								<div className="flex gap-3 w-full">
									<button
										onClick={() => {
											setDeleteModalOpen(false);
											setUserToDelete(null);
										}}
										disabled={loading}
										className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-400 rounded-xl text-white hover:bg-gray-500 transition shadow-md hover:shadow-lg disabled:opacity-50">
										<X className="w-5 h-5" />
										Отмена
									</button>
									<button
										onClick={handleDelete}
										disabled={loading}
										className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white hover:from-red-700 hover:to-red-800 transition shadow-md hover:shadow-lg disabled:opacity-50">
										{loading ? (
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										) : (
											<Trash2 className="w-5 h-5" />
										)}
										Удалить
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
