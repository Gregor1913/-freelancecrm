'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function PricingPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })
      if (!response.ok) {
        if (response.status === 401) {
          alert('Чтобы оформить подписку, сначала войдите в аккаунт.')
        } else {
          let errorMessage = 'Ошибка при оформлении подписки'
          try {
            const errorData = await response.json()
            if (errorData?.error) {
              errorMessage = errorData.error
            }
          } catch {
            // игнорируем ошибки парсинга
          }
          alert(errorMessage)
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        alert('Не удалось получить ссылку на оплату. Попробуйте ещё раз.')
      }
    } catch (error) {
      alert('Ошибка при оформлении подписки')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#f9fafb', minHeight: '100vh', padding: '3rem 2rem'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>

        {/* Заголовок */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
            Простые и честные тарифы
          </h1>
          <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
            Начни бесплатно — переходи на Pro когда будешь готов
          </p>
        </div>

        {/* Карточки тарифов */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>

          {/* Free */}
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '2px solid #e5e7eb'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                Free
              </h2>
              <p style={{color: '#6b7280', fontSize: '0.9rem'}}>
                Для старта и знакомства с продуктом
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <span style={{fontSize: '3rem', fontWeight: 'bold', color: '#111827'}}>$0</span>
              <span style={{color: '#6b7280'}}>/месяц</span>
            </div>

            {/* Фичи */}
            {[
              '✅ До 3 клиентов',
              '✅ До 3 сделок',
              '✅ До 3 инвойсов',
              '❌ Скачивание PDF',
              '❌ Аналитика',
              '❌ Безлимитные записи',
            ].map((feature, i) => (
              <p key={i} style={{color: feature.startsWith('❌') ? '#9ca3af' : '#374151', marginBottom: '0.5rem', fontSize: '0.95rem'}}>
                {feature}
              </p>
            ))}

            <div style={{marginTop: '2rem'}}>
              {user ? (
                <Link
                  href="/dashboard"
                  style={{display: 'block', textAlign: 'center', border: '2px solid #e5e7eb', color: '#374151', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none'}}
                >
                  Текущий план
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  style={{display: 'block', textAlign: 'center', border: '2px solid #e5e7eb', color: '#374151', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none'}}
                >
                  Начать бесплатно
                </Link>
              )}
            </div>
          </div>

          {/* Pro */}
          <div style={{backgroundColor: '#2563eb', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 25px rgba(37,99,235,0.3)', border: '2px solid #2563eb', position: 'relative'}}>

            {/* Бейдж */}
            <div style={{position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600'}}>
              ПОПУЛЯРНЫЙ
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem'}}>
                Pro
              </h2>
              <p style={{color: '#bfdbfe', fontSize: '0.9rem'}}>
                Для серьёзной работы и роста
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <span style={{fontSize: '3rem', fontWeight: 'bold', color: 'white'}}>$9</span>
              <span style={{color: '#bfdbfe'}}>/месяц</span>
            </div>

            {/* Фичи */}
            {[
              '✅ Безлимитные клиенты',
              '✅ Безлимитные сделки',
              '✅ Безлимитные инвойсы',
              '✅ Скачивание PDF',
              '✅ Аналитика и отчёты',
              '✅ Приоритетная поддержка',
            ].map((feature, i) => (
              <p key={i} style={{color: 'white', marginBottom: '0.5rem', fontSize: '0.95rem'}}>
                {feature}
              </p>
            ))}

            <div style={{marginTop: '2rem'}}>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                style={{width: '100%', backgroundColor: 'white', color: '#2563eb', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
              >
                {loading ? 'Загрузка...' : '🚀 Перейти на Pro'}
              </button>
            </div>
          </div>

        </div>

        {/* Назад */}
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <Link
            href="/dashboard"
            style={{color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem'}}
          >
            ← Вернуться в Dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}