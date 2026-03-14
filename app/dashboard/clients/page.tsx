"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/clients", label: "Клиенты", icon: "👥" },
  { href: "/dashboard/deals", label: "Сделки", icon: "💼" },
  { href: "/dashboard/invoices", label: "Инвойсы", icon: "📄" },
  { href: "/dashboard/reminders", label: "Напоминания", icon: "🔔" },
];

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
};

export default function ClientsPage() {
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (client.name ?? "").toLowerCase();
    const email = (client.email ?? "").toLowerCase();
    const company = (client.company ?? "").toLowerCase();
    return name.includes(q) || email.includes(q) || company.includes(q);
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchClients = async () => {
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setClients((data as Client[]) ?? []);
      setLoading(false);
    };

    fetchClients();
  }, [user?.id]);

  const handleDeleteClient = async (id: string) => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Вы уверены что хотите удалить клиента?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Ошибка при удалении клиента:", error.message);
      return;
    }

    setClients((prev) => prev.filter((client) => client.id !== id));
  };
  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <Link href="/dashboard" className="cursor-pointer text-lg font-bold text-zinc-900">
            FreelanceCRM
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
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
          <h1 className="text-xl font-semibold text-zinc-800">Клиенты</h1>
          <UserButton />
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-800">Мои клиенты</h2>
            <Link
              href="/dashboard/clients/new"
              className="w-fit cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Добавить клиента
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-16 shadow-sm">
              <p className="text-center text-zinc-500">Загрузка...</p>
            </div>
          ) : clients.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-zinc-200 bg-white p-16 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl">
                  👥
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-800">
                  Клиентов пока нет
                </h3>
                <p className="mb-6 max-w-sm text-zinc-500">
                  Добавьте первого клиента, чтобы начать вести базу контактов
                </p>
                <Link
                  href="/dashboard/clients/new"
                  className="cursor-pointer rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Добавить первого клиента
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по имени, email или компании..."
                  className="w-full max-w-md rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              {filteredClients.length === 0 ? (
                /* Nothing found */
                <div className="rounded-xl border border-zinc-200 bg-white p-12 shadow-sm">
                  <p className="text-center text-zinc-500">
                    Ничего не найдено по запросу:{" "}
                    <span className="font-medium text-zinc-700">
                      {searchQuery.trim()}
                    </span>
                  </p>
                </div>
              ) : (
                /* Table */
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Имя клиента
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Телефон
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Компания
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Дата добавления
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="transition-colors hover:bg-zinc-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">
                          {client.email ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">
                          {client.phone ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">
                          {client.company ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">
                          {new Date(client.created_at).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/dashboard/clients/${client.id}/edit`}
                              className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                            >
                              Редактировать
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(client.id)}
                              className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

