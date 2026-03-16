'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  created_at: string
}

export default function ClientsPage() {
  const { user } = useUser()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user) loadClients()
  }, [user])

  async function loadClients() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setClients(data)
    setLoading(false)
  }

  async function deleteClient(id: string) {
    if (!confirm('Удалить клиента?')) return
    await supabase.from('clients').delete().eq('id', id)
    setClients(clients.filter(c => c.id !== id))
  }

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{padding: '2rem', color: '#111827'}}>Загрузка...</div>
  )

  return (
    <div style={{backgroundColor: '#f9fafb', minHeight: '100vh', padding: '1rem'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>

        {/* Заголовок */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0}}>
            👥 Клиенты
          </h1>
          <Link
            href="/dashboard/clients/new"
            style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem'}}
          >
            + Добавить
          </Link>
        </div>

        {/* Поиск */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Поиск по имени, email, компании..."
          style={{width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.625rem 1rem', color: '#111827', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: 'white'}}
        />

        {/* Список клиентов */}
        {filtered.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px'}}>
            <p style={{fontSize: '3rem', margin: '0 0 0.5rem 0'}}>👥</p>
            <p style={{color: '#111827', fontWeight: '600', margin: '0 0 0.25rem 0'}}>
              {search ? `Ничего не найдено по "${search}"` : 'Клиентов пока нет'}
            </p>
            <p style={{color: '#6b7280', margin: '0 0 1rem 0'}}>
              Добавьте первого клиента
            </p>
            <Link
              href="/dashboard/clients/new"
              style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none'}}
            >
              + Добавить клиента
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {filtered.map(client => (
              <div
                key={client.id}
                style={{backgroundColor: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb'}}
              >
                {/* Верхняя строка — имя и кнопки */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                  <div>
                    <p style={{fontWeight: '700', color: '#111827', margin: '0 0 0.2rem 0', fontSize: '1rem'}}>
                      {client.name}
                    </p>
                    {client.company && (
                      <p style={{color: '#6b7280', fontSize: '0.8rem', margin: 0}}>
                        🏢 {client.company}
                      </p>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', flexShrink: 0}}>
                    <Link
                      href={`/dashboard/clients/${client.id}/edit`}
                      style={{padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', color: '#374151', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '500'}}
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => deleteClient(client.id)}
                      style={{padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem'}}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Контактная информация */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem'}}>
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      style={{color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem'}}
                    >
                      📧 {client.email}
                    </a>
                  )}
                  {client.phone && (
                    <a
                      href={`tel:${client.phone}`}
                      style={{color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem'}}
                    >
                      📞 {client.phone}
                    </a>
                  )}
                </div>

                {/* Дата */}
                <p style={{color: '#9ca3af', fontSize: '0.75rem', margin: '0.5rem 0 0 0'}}>
                  Добавлен: {new Date(client.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Счётчик */}
        {filtered.length > 0 && (
          <p style={{textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', marginTop: '1rem'}}>
            Показано {filtered.length} из {clients.length} клиентов
          </p>
        )}

      </div>
    </div>
  )
}