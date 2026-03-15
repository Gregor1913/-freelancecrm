"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/clients", label: "Клиенты", icon: "👥" },
  { href: "/dashboard/deals", label: "Сделки", icon: "💼" },
  { href: "/dashboard/invoices", label: "Инвойсы", icon: "📄" },
  { href: "/dashboard/reminders", label: "Напоминания", icon: "🔔" },
];

const statCards = [
  { label: "Всего клиентов", value: "0" },
  { label: "Активных сделок", value: "0" },
  { label: "Инвойсов", value: "0" },
  { label: "Доход", value: "$0" },
];

export default function Dashboard() {
  const { user } = useUser();

  const emailName =
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "";
  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.username ||
    emailName ||
    "Пользователь";

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
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 data-[active]:bg-zinc-100 data-[active]:text-zinc-900"
              data-active={link.href === "/dashboard"}
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
            Привет, {displayName}! 👋
          </h1>
          <div className="flex items-center">
            <UserButton />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          {/* Stats */}
          <section className="mb-10">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow"
                >
                  <p className="mb-2 text-sm font-medium text-zinc-500">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-800">
              Последние действия
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white p-12 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-2xl">
                  📋
                </div>
                <p className="text-zinc-500">Пока нет активности</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Ваши действия появятся здесь
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
