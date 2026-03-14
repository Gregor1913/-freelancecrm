"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/clients", label: "Клиенты", icon: "👥" },
  { href: "/dashboard/deals", label: "Сделки", icon: "💼" },
  { href: "/dashboard/invoices", label: "Инвойсы", icon: "📄" },
  { href: "/dashboard/reminders", label: "Напоминания", icon: "🔔" },
];

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  useEffect(() => {
    if (!id || !user?.id) return;

    const fetchClient = async () => {
      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      setLoadingClient(false);

      if (fetchError || !data) {
        setError("Клиент не найден");
        return;
      }

      setFormData({
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        company: data.company ?? "",
        notes: data.notes ?? "",
      });
    };

    fetchClient();
  }, [id, user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Поле «Имя» обязательно");
      return;
    }

    if (!user?.id) {
      setError("Пользователь не авторизован");
      return;
    }

    setLoading(true);

    const { error: supabaseError } = await supabase
      .from("clients")
      .update({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        notes: formData.notes.trim() || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    router.push("/dashboard/clients");
  };

  if (loadingClient) {
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
        <div className="ml-64 flex flex-1 items-center justify-center">
          <p className="text-zinc-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-800">
            Редактировать клиента
          </h1>
          <UserButton />
        </header>

        {/* Content */}
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
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Иван Иванов"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ivan@example.com"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Компания
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="ООО Компания"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Заметки
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Дополнительная информация о клиенте..."
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
                  {loading ? "Сохранение..." : "Сохранить"}
                </button>
                <Link
                  href="/dashboard/clients"
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
