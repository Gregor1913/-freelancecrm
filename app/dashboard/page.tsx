'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Stats {
  totalClients: number
  totalDeals: number
  totalInvoices: number
  totalRevenue: number
  paidInvoices: number
  activeDeals: number
}

export default function Dashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalDeals: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    paidInvoices: 0,
    activeDeals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadStats()
  }, [user])

  async function loadStats() {
    const [clients, deals, invoices] = await Promise.all([
      supabase.from('clients').select('id').eq('user_id', user?.id),
      supabase.from('deals').select('id, status').eq('user_id', user?.id),
      supabase.from('invoices').select('id, amount, status').eq('user_id', user?.id),
    ])

    const paidInvoices = invoices.data?.filter(inv => inv.status === 'paid') || []
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const activeDeals = deals.data?.filter(d => d.status === 'in_progress').length || 0

    setStats({
      totalClients: clients.data?.length || 0,
      totalDeals: deals.data?.length || 0,
      totalInvoices: invoices.data?.length || 0,
      totalRevenue,
      paidInvoices: paidInvoices.length,
      activeDeals,
    })
    setLoading(false)
  }

  const cards = [
    { label: 'Всего клиентов',   value: stats.totalClients,              icon: '👥', color: '#3b82f6', bg: '#eff6ff', link: '/dashboard/clients' },
    { label: 'Активных сделок',  value: stats.activeDeals,               icon: '💼', color: '#f59e0b', bg: '#fffbeb', link: '/dashboard/deals' },
    { label: 'Инвойсов оплачено',value: stats.paidInvoices,              icon: '📄', color: '#22c55e', bg: '#f0fdf4', link: '/dashboard/invoices' },
    { label: 'Общий доход',      value: `${stats.totalRevenue.toLocaleString()} ₽`, icon: '💰', color: '#8b5cf6', bg: '#f5f3ff', link: '/dashboard/invoices' },
  ]

  return (
    <div style={{backgroundColor: '#f9fafb', minHeight: '100vh'}}>

      {/* Mobile Navbar */}
      <nav
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 1rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Logo + Username (compact) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2563eb' }}>FreelanceCRM</span>
          <span style={{ color: '#6b7280', fontSize: '0.75rem', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>

        {/* Right side: quick actions + user button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Primary shortcut to main dashboard */}
          <Link
            href="/dashboard"
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '999px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            🏠
          </Link>

          {/* Compact Pro badge */}
          <Link
            href="/pricing"
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: '999px',
              border: '1px solid #e5e7eb',
              fontSize: '0.75rem',
              textDecoration: 'none',
            }}
          >
            ⭐ Pro
          </Link>

          {/* User avatar */}
          <div style={{ transform: 'scale(0.9)' }}>
            <UserButton />
          </div>
        </div>
      </nav>

      {/* Контент */}
      <div style={{padding: '2rem'}}>

        {/* Приветствие */}
        <div style={{marginBottom: '2rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0'}}>
            Привет, {user?.firstName || 'фрилансер'}! 👋
          </h2>
          <p style={{color: '#6b7280', margin: 0}}>
            Вот что происходит в твоём бизнесе сегодня
          </p>
        </div>

        {/* Карточки статистики */}
        {loading ? (
          <p style={{color: '#6b7280'}}>Загрузка статистики...</p>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
            {cards.map((card, i) => (
              <Link
                key={i}
                href={card.link}
                style={{textDecoration: 'none'}}
              >
                <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${card.color}20`, cursor: 'pointer', transition: 'transform 0.1s'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                    <span style={{fontSize: '2rem'}}>{card.icon}</span>
                    <span style={{backgroundColor: card.bg, color: card.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600'}}>
                      Live
                    </span>
                  </div>
                  <p style={{fontSize: '2rem', fontWeight: 'bold', color: card.color, margin: '0 0 0.25rem 0'}}>
                    {card.value}
                  </p>
                  <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>
                    {card.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Быстрые действия */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem'}}>
          <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 1rem 0'}}>
            Быстрые действия
          </h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
            {[
              { href: '/dashboard/clients/new',  label: '+ Новый клиент',  color: '#3b82f6' },
              { href: '/dashboard/deals/new',    label: '+ Новая сделка',  color: '#f59e0b' },
              { href: '/dashboard/invoices/new', label: '+ Новый инвойс',  color: '#22c55e' },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                style={{display: 'block', textAlign: 'center', backgroundColor: action.color, color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', fontSize: '0.95rem'}}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Апгрейд баннер */}
        <div style={{background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '12px', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h3 style={{fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.25rem 0'}}>
              ⭐ Перейди на Pro
            </h3>
            <p style={{color: '#bfdbfe', margin: 0, fontSize: '0.9rem'}}>
              Безлимитные клиенты, сделки и инвойсы за $9/месяц
            </p>
          </div>
          <Link
            href="/pricing"
            style={{backgroundColor: 'white', color: '#2563eb', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap'}}
          >
            Попробовать Pro →
          </Link>
        </div>

      </div>
    </div>
  )
}