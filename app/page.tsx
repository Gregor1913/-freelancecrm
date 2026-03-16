import Link from 'next/link'

export default function Home() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: 'white'}}>

      {/* Navbar */}
      <nav style={{borderBottom: '1px solid #e5e7eb', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', margin: 0}}>
          FreelanceCRM
        </h1>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <Link href="/pricing" style={{color: '#374151', textDecoration: 'none', fontWeight: '500'}}>
            Тарифы
          </Link>
          <Link
            href="/sign-in"
            style={{border: '1px solid #e5e7eb', color: '#374151', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500'}}
          >
            Войти
          </Link>
          <Link
            href="/sign-up"
            style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500'}}
          >
            Начать бесплатно
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{textAlign: 'center', padding: '5rem 2rem 3rem'}}>
        <h2 style={{fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', lineHeight: '1.2'}}>
          CRM для фрилансеров
        </h2>
        <p style={{fontSize: '1.25rem', color: '#6b7280', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem'}}>
          Управляй клиентами, сделками и инвойсами в одном месте
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link
            href="/sign-up"
            style={{backgroundColor: '#2563eb', color: 'white', padding: '0.875rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem'}}
          >
            Начать бесплатно →
          </Link>
          <Link
            href="/pricing"
            style={{border: '2px solid #e5e7eb', color: '#374151', padding: '0.875rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem'}}
          >
            Смотреть тарифы
          </Link>
        </div>
      </div>

      {/* Карточки */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', padding: '2rem'}}>
        {[
          { icon: '👥', title: 'Клиенты', desc: 'Храни контакты и историю взаимодействия со всеми клиентами в удобной базе' },
          { icon: '💼', title: 'Сделки', desc: 'Отслеживай этапы сделок на Kanban доске и не упускай новые проекты' },
          { icon: '📄', title: 'Инвойсы', desc: 'Создавай счета и скачивай PDF в один клик. Контролируй оплаты' },
        ].map((card, i) => (
          <div key={i} style={{backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb'}}>
            <p style={{fontSize: '2rem', marginBottom: '0.75rem'}}>{card.icon}</p>
            <h3 style={{fontWeight: '600', color: '#111827', marginBottom: '0.5rem', fontSize: '1.1rem'}}>{card.title}</h3>
            <p style={{color: '#6b7280', lineHeight: '1.6', margin: 0}}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA баннер */}
      <div style={{background: 'linear-gradient(135deg, #2563eb, #7c3aed)', margin: '2rem auto', maxWidth: '900px', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center'}}>
        <h3 style={{color: 'white', fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem'}}>
          Готов начать?
        </h3>
        <p style={{color: '#bfdbfe', marginBottom: '2rem', fontSize: '1.1rem'}}>
          Бесплатно — без кредитной карты
        </p>
        <Link
          href="/sign-up"
          style={{backgroundColor: 'white', color: '#2563eb', padding: '0.875rem 2.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem'}}
        >
          Создать аккаунт бесплатно
        </Link>
      </div>

      {/* Футер */}
      <footer style={{borderTop: '1px solid #e5e7eb', padding: '2rem', textAlign: 'center'}}>
        <p style={{color: '#9ca3af', margin: 0}}>
          © 2026 FreelanceCRM. Все права защищены.
        </p>
      </footer>

    </div>
  )
}