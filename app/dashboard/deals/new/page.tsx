"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/clients", label: "Клиенты", icon: "👥" },
  { href: "/dashboard/deals", label: "Сделки", icon: "💼" },
  { href: "/dashboard/invoices", label: "Инвойсы", icon: "📄" },
  { href: "/dashboard/reminders", label: "Напоминания", icon: "🔔" },
];

type Client = { id: string; name: string };

const STATUS_OPTIONS = [
  { value: "lead", label: "Лид" },
  { value: "negotiation", label: "Переговоры" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Оплачено" },
];

export default function NewDealPage() {
  const router = useRouter();
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    client_id: "",
    status: "lead",
    notes: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    const loadClients = async () => {
      const { data } = await supabase
        .from("clients")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");
      setClients((data as Client[]) ?? []);
    };
    loadClients();
  }, [user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.title.trim()) {
      setError("Название сделки обязательно");
      return;
    }
    if (!user?.id) {
      setError("Пользователь не авторизован");
      return;
    }

    setLoading(true);
    const { error: supabaseError } = await supabase.from("deals").insert({
      title: formData.title.trim(),
      amount: Number(formData.amount) || 0,
      client_id: formData.client_id || null,
      status: formData.status,
      notes: formData.notes.trim() || null,
      user_id: user.id,
    });
    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }
    router.push("/dashboard/deals");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <Link href="/dashboard" className="text-lg font-bold text-zinc-900">
            FreelanceCRM
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-800">Новая сделка</h1>
          <UserButton />
        </header>

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm"
            >
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-700">
                    Название сделки <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Например: Сайт под ключ"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="mb-2 block text-sm font-medium text-zinc-700">
                    Сумма (₽)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min={0}
                    placeholder="50000"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label htmlFor="client_id" className="mb-2 block text-sm font-medium text-zinc-700">
                    Клиент
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  >
                    <option value="">Выберите клиента</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="mb-2 block text-sm font-medium text-zinc-700">
                    Статус
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium text-zinc-700">
                    Заметки
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Дополнительная информация..."
                    className="w-full resize-y rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
                >
                  {loading ? "Сохранение..." : "Сохранить сделку"}
                </button>
                <Link
                  href="/dashboard/deals"
                  className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Отмена
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
