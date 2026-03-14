'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Client {
  id: string
  name: string
}

export default function NewInvoicePage() {
  const { user } = useUser()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_id: '',
    amount: '',
    due_date: '',
    notes: '',
    status: 'draft',
  })

  useEffect(() => {
    if (user) loadClients()
  }, [user])

  async function loadClients() {
    const { data } = await supabase
      .from('clients')
      .select('id, name')
      .eq('user_id', user?.id)
    if (data) setClients(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { error } = await supabase.from('invoices').insert({
      client_id: form.client_id || null,
      amount: parseFloat(form.amount) || 0,
      due_date: form.due_date || null,
      notes: form.notes,
      status: form.status,
      user_id: user.id,
    })

    if (!error) {
      router.push('/dashboard/invoices')
    } else {
      alert('Ошибка: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem'}}>
      <div style={{maxWidth: '600px', margin: '0 auto'}}>

        <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
          Новый инвойс
        </h1>
        <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
          Создайте счёт на оплату для клиента
        </p>

        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <form onSubmit={handleSubmit}>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>
                Клиент *
              </label>
              <select
                required
                value={form.client_id}
                onChange={e => setForm({...form, client_id: e.target.value})}
                style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', boxSizing: 'border-box'}}
              >
                <option value="">Выберите клиента</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>
                Сумма (₽) *
              </label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                placeholder="50000"
                style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', boxSizing: 'border-box'}}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>
                Срок оплаты
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm({...form, due_date: e.target.value})}
                style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', boxSizing: 'border-box'}}
              />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>
                Статус
              </label>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
                style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', boxSizing: 'border-box'}}
              >
                <option value="draft">Черновик</option>
                <option value="sent">Отправлен</option>
                <option value="paid">Оплачен</option>
                <option value="overdue">Просрочен</option>
              </select>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.25rem'}}>
                Заметки / Описание работ
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                rows={4}
                placeholder="Разработка сайта под ключ, 10 страниц..."
                style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', boxSizing: 'border-box'}}
              />
            </div>

            <div style={{display: 'flex', gap: '0.75rem'}}>
              <button
                type="submit"
                disabled={loading}
                style={{flex: 1, backgroundColor: '#2563eb', color: 'white', padding: '0.625rem', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
              >
                {loading ? 'Сохранение...' : '💾 Сохранить инвойс'}
              </button>
              <Link
                href="/dashboard/invoices"
                style={{flex: 1, textAlign: 'center', border: '1px solid #d1d5db', color: '#374151', padding: '0.625rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', fontSize: '1rem'}}
              >
                Отмена
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
