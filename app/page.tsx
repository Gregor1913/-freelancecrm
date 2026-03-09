export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-xl font-bold text-zinc-900">FreelanceCRM</span>
          <a
            href="#"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Войти
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
            CRM для фрилансеров
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 sm:text-xl">
            Управляй клиентами, сделками и инвойсами в одном месте
          </p>
          <a
            href="#"
            className="inline-block rounded-lg bg-zinc-900 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Начать бесплатно
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-900">Клиенты</h3>
              <p className="text-zinc-600">
                Храни контакты и историю взаимодействия со всеми клиентами в удобной базе
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-900">Сделки</h3>
              <p className="text-zinc-600">
                Отслеживай этапы сделок и не упускай возможности закрыть новый проект
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-900">Инвойсы</h3>
              <p className="text-zinc-600">
                Создавай счета и контролируй оплаты в пару кликов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm font-medium text-zinc-600">FreelanceCRM</span>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-zinc-900">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-zinc-900">
                Условия использования
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-400 sm:text-left">
            © {new Date().getFullYear()} FreelanceCRM. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
