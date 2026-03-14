'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Deal {
  id: string
  title: string
  amount: number
  status: string
  notes: string
  client_id: string
  clients?: { name: string }
}

const COLUMNS = [
  { id: 'lead',        label: '👋 Лид',        color: '#3b82f6', bg: '#eff6ff' },
  { id: 'negotiation', label: '💬 Переговоры',  color: '#f59e0b', bg: '#fffbeb' },
  { id: 'in_progress', label: '⚙️ В работе',    color: '#f97316', bg: '#fff7ed' },
  { id: 'done',        label: '✅ Оплачено',    color: '#22c55e', bg: '#f0fdf4' },
]

const STATUSES = ['lead', 'negotiation', 'in_progress', 'done']

export default function DealsPage() {
  const { user } = useUser()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadDeals()
  }, [user])

  async function loadDeals() {
    const { data } = await supabase
      .from('deals')
      .select('*, clients(name)')
      .eq('user_id', user?.id)
    if (data) setDeals(data)
    setLoading(false)
  }

  async function moveCard(deal: Deal, direction: 'left' | 'right') {
    const currentIndex = STATUSES.indexOf(deal.status)
    const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1
    if (newIndex < 0 || newIndex >= STATUSES.length) return

    const newStatus = STATUSES[newIndex]
    await supabase.from('deals').update({ status: newStatus }).eq('id', deal.id)
    setDeals(deals.map(d => d.id === deal.id ? { ...d, status: newStatus } : d))
  }

  async function deleteDeal(id: string) {
    if (!confirm('Удалить сделку?')) return
    await supabase.from('deals').delete().eq('id', id)
    setDeals(deals.filter(d => d.id !== id))
  }

  if (loading) return (
    <div style={{padding: '2rem', color: '#111827'}}>Загрузка...</div>
  )

  return (
    <div style={{padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh'}}>

      {/* Заголовок */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>
          Мои сделки
        </h1>
        <Link
          href="/dashboard/deals/new"
          style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500'}}
        >
          + Добавить сделку
        </Link>
      </div>

      {/* Kanban доска */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
        {COLUMNS.map(col => {
          const colDeals = deals.filter(d => d.status === col.id)
          const total = colDeals.reduce((sum, d) => sum + (d.amount || 0), 0)

          return (
            <div key={col.id} style={{backgroundColor: col.bg, borderRadius: '12px', padding: '1rem', border: `2px solid ${col.color}20`}}>

              {/* Заголовок колонки */}
              <div style={{marginBottom: '1rem'}}>
                <h2 style={{fontWeight: 'bold', color: col.color, fontSize: '1rem'}}>
                  {col.label}
                </h2>
                <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
                  {colDeals.length} сделок · {total.toLocaleString()} ₽
                </p>
              </div>

              {/* Карточки */}
              {colDeals.length === 0 ? (
                <p style={{color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '1rem'}}>
                  Нет сделок
                </p>
              ) : (
                colDeals.map(deal => (
                  <div
                    key={deal.id}
                    style={{backgroundColor: 'white', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
                  >
                    {/* Название */}
                    <p style={{fontWeight: '600', color: '#111827', marginBottom: '0.25rem', fontSize: '0.95rem'}}>
                      {deal.title}
                    </p>

                    {/* Клиент */}
                    {deal.clients?.name && (
                      <p style={{color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.25rem'}}>
                        👤 {deal.clients.name}
                      </p>
                    )}

                    {/* Сумма */}
                    <p style={{color: col.color, fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.75rem'}}>
                      {deal.amount?.toLocaleString()} ₽
                    </p>

                    {/* Кнопки */}
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={() => moveCard(deal, 'left')}
                        disabled={deal.status === 'lead'}
                        style={{flex: 1, padding: '0.25rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', color: '#374151', fontSize: '0.8rem'}}
                      >
                        ← 
                      </button>
                      <button
                        onClick={() => moveCard(deal, 'right')}
                        disabled={deal.status === 'done'}
                        style={{flex: 1, padding: '0.25rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', color: '#374151', fontSize: '0.8rem'}}
                      >
                        →
                      </button>
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        style={{padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem'}}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}