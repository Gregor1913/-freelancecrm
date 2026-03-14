'use client'

import { useState, useEffect, use } from 'react'
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
  clients?: {
    name: string
    email: string
    phone: string
    company: string
  }
}

export default function InvoicePage(props: {
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const id = params.id

  const { user } = useUser()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && id) loadInvoice()
  }, [user, id])

  async function loadInvoice() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, clients(name, email, phone, company)')
      .eq('id', id)
      .single()
    if (data) setInvoice(data)
    if (error) console.error('Ошибка:', error)
    setLoading(false)
  }

  function printInvoice() {
    window.print()
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft:   { label: 'Черновик',  color: '#6b7280' },
    sent:    { label: 'Отправлен', color: '#3b82f6' },
    paid:    { label: 'Оплачен',   color: '#22c55e' },
    overdue: { label: 'Просрочен', color: '#ef4444' },
  }
  const status = invoice ? (statusLabels[invoice.status] || statusLabels.draft) : statusLabels.draft

  if (loading) return (
    <div style={{padding: '2rem', color: '#111827'}}>Загрузка...</div>
  )

  if (!invoice) return (
    <div style={{padding: '2rem'}}>
      <p style={{color: '#111827', marginBottom: '1rem'}}>Инвойс не найден</p>
      <Link href="/dashboard/invoices" style={{color: '#2563eb'}}>← Назад</Link>
    </div>
  )

  return (
    <>
      {/* Стили для печати */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .invoice-card {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div style={{padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>

          {/* Навигация — скрывается при печати */}
          <div className="no-print" style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Link
              href="/dashboard/invoices"
              style={{color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem'}}
            >
              ← Все инвойсы
            </Link>
            <button
              onClick={printInvoice}
              style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
            >
              📥 Скачать PDF
            </button>
          </div>

          {/* Инвойс — печатается */}
          <div
            className="invoice-card"
            style={{backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
          >
            {/* Шапка */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
              <div>
                <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '0 0 0.25rem 0'}}>
                  FreelanceCRM
                </h1>
                <p style={{color: '#6b7280', margin: 0}}>Счёт на оплату</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', margin: '0 0 0.25rem 0'}}>
                  № {invoice.id.slice(0, 8).toUpperCase()}
                </p>
                <p style={{color: status.color, fontWeight: '500', margin: 0}}>
                  {status.label}
                </p>
              </div>
            </div>

            {/* Даты */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px'}}>
              <div>
                <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '0 0 0.25rem 0'}}>Дата создания</p>
                <p style={{color: '#111827', fontWeight: '500', margin: 0}}>
                  {new Date(invoice.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              {invoice.due_date && (
                <div>
                  <p style={{color: '#6b7280', fontSize: '0.8rem', margin: '0 0 0.25rem 0'}}>Срок оплаты</p>
                  <p style={{color: '#111827', fontWeight: '500', margin: 0}}>
                    {new Date(invoice.due_date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}
            </div>

            {/* Клиент */}
            {invoice.clients && (
              <div style={{marginBottom: '2rem'}}>
                <p style={{color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.75rem 0'}}>
                  Клиент
                </p>
                <p style={{color: '#111827', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 0.25rem 0'}}>
                  {invoice.clients.name}
                </p>
                {invoice.clients.company && (
                  <p style={{color: '#374151', margin: '0 0 0.2rem 0'}}>{invoice.clients.company}</p>
                )}
                {invoice.clients.email && (
                  <p style={{color: '#6b7280', margin: '0 0 0.2rem 0'}}>{invoice.clients.email}</p>
                )}
                {invoice.clients.phone && (
                  <p style={{color: '#6b7280', margin: 0}}>{invoice.clients.phone}</p>
                )}
              </div>
            )}

            {/* Описание */}
            {invoice.notes && (
              <div style={{marginBottom: '2rem'}}>
                <p style={{color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.75rem 0'}}>
                  Описание работ
                </p>
                <p style={{color: '#374151', lineHeight: '1.7', margin: 0}}>
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Итого */}
            <div style={{borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p style={{color: '#374151', fontWeight: '500', fontSize: '1.1rem', margin: 0}}>
                  Итого к оплате:
                </p>
                <p style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb', margin: 0}}>
                  {invoice.amount?.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            {/* Футер */}
            <div style={{marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb'}}>
              <p style={{color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', margin: 0}}>
                Создано с помощью FreelanceCRM
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
