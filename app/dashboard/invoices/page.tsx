'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Invoice {
  id: string
  amount: number
  status: string
  due_date: string
  notes: string
  created_at: string
  clients?: { name: string }
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Черновик',  color: '#6b7280', bg: '#f3f4f6' },
  sent:      { label: 'Отправлен', color: '#3b82f6', bg: '#eff6ff' },
  paid:      { label: 'Оплачен',   color: '#22c55e', bg: '#f0fdf4' },
  overdue:   { label: 'Просрочен', color: '#ef4444', bg: '#fef2f2' },
}

export default function InvoicesPage() {
  const { user } = useUser()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadInvoices()
  }, [user])

  async function loadInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*, clients(name)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setInvoices(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('invoices').update({ status }).eq('id', id)
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    ))
  }

  async function deleteInvoice(id: string) {
    if (!confirm('Удалить инвойс?')) return
    await supabase.from('invoices').delete().eq('id', id)
    setInvoices(invoices.filter(inv => inv.id !== id))
  }

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  if (loading) return (
    <div style={{padding: '2rem', color: '#111827'}}>Загрузка...</div>
  )

  return (
    <div style={{padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh'}}>

      {/* Заголовок */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>
            Инвойсы
          </h1>
          <p style={{color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem'}}>
            Получено: {totalPaid.toLocaleString()} ₽
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500'}}
        >
          + Новый инвойс
        </Link>
      </div>

      {/* Карточки статистики */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
        {Object.entries(STATUS_LABELS).map(([status, style]) => {
          const count = invoices.filter(inv => inv.status === status).length
          const amount = invoices
            .filter(inv => inv.status === status)
            .reduce((sum, inv) => sum + inv.amount, 0)
          return (
            <div key={status} style={{backgroundColor: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <p style={{color: style.color, fontWeight: '600', fontSize: '0.875rem'}}>
                {style.label}
              </p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827'}}>
                {count}
              </p>
              <p style={{color: '#6b7280', fontSize: '0.8rem'}}>
                {amount.toLocaleString()} ₽
              </p>
            </div>
          )
        })}
      </div>

      {/* Список инвойсов */}
      {invoices.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px'}}>
          <p style={{fontSize: '3rem'}}>📄</p>
          <p style={{color: '#111827', fontWeight: '600', fontSize: '1.1rem'}}>
            Инвойсов пока нет
          </p>
          <p style={{color: '#6b7280', marginBottom: '1rem'}}>
            Создайте первый инвойс для клиента
          </p>
          <Link
            href="/dashboard/invoices/new"
            style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none'}}
          >
            Создать инвойс
          </Link>
        </div>
      ) : (
        <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
          <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '600px'}}>
            <thead>
              <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                <th style={{padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '0.875rem'}}>Клиент</th>
                <th style={{padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '0.875rem'}}>Сумма</th>
                <th style={{padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '0.875rem'}}>Статус</th>
                <th style={{padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '0.875rem'}}>Срок оплаты</th>
                <th style={{padding: '0.75rem 1rem', textAlign: 'left', color: '#374151', fontWeight: '600', fontSize: '0.875rem'}}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => {
                const status = STATUS_LABELS[invoice.status] || STATUS_LABELS.draft
                return (
                  <tr
                    key={invoice.id}
                    style={{borderBottom: index < invoices.length - 1 ? '1px solid #e5e7eb' : 'none'}}
                  >
                    <td style={{padding: '0.75rem 1rem', color: '#111827', fontWeight: '500'}}>
                      {invoice.clients?.name || '—'}
                    </td>
                    <td style={{padding: '0.75rem 1rem', color: '#111827', fontWeight: '600'}}>
                      {invoice.amount?.toLocaleString()} ₽
                    </td>
                    <td style={{padding: '0.75rem 1rem'}}>
                      <span style={{backgroundColor: status.bg, color: status.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500'}}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.875rem'}}>
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td style={{padding: '0.75rem 1rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <select
                          value={invoice.status}
                          onChange={e => updateStatus(invoice.id, e.target.value)}
                          style={{border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: '#374151'}}
                        >
                          <option value="draft">Черновик</option>
                          <option value="sent">Отправлен</option>
                          <option value="paid">Оплачен</option>
                          <option value="overdue">Просрочен</option>
                        </select>
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          style={{padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', color: '#374151', textDecoration: 'none', fontSize: '0.8rem'}}
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          style={{padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem'}}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}