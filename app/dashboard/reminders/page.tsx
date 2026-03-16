'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Reminder {
  id: string
  title: string
  due_date: string
  done: boolean
  clients?: { name: string }
}

export default function RemindersPage() {
  const { user } = useUser()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    if (user) loadReminders()
  }, [user])

  async function loadReminders() {
    const { data } = await supabase
      .from('reminders')
      .select('*, clients(name)')
      .eq('user_id', user?.id)
      .order('due_date', { ascending: true })
    if (data) setReminders(data)
    setLoading(false)
  }

  async function addReminder() {
    if (!newTitle || !user) return
    const { data } = await supabase.from('reminders').insert({
      title: newTitle,
      due_date: newDate || null,
      user_id: user.id,
      done: false,
    }).select().single()
    if (data) setReminders([...reminders, data])
    setNewTitle('')
    setNewDate('')
  }

  async function toggleDone(id: string, done: boolean) {
    await supabase.from('reminders').update({ done: !done }).eq('id', id)
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !done } : r))
  }

  async function deleteReminder(id: string) {
    await supabase.from('reminders').delete().eq('id', id)
    setReminders(reminders.filter(r => r.id !== id))
  }

  if (loading) return (
    <div style={{padding: '2rem', color: '#111827'}}>Загрузка...</div>
  )

  return (
    <div style={{padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0'}}>
              🔔 Напоминания
            </h1>
            <p style={{color: '#6b7280', margin: 0, fontSize: '0.875rem'}}>
              {reminders.filter(r => !r.done).length} активных
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem'}}
          >
            ← Dashboard
          </Link>
        </div>

        {/* Форма добавления */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem'}}>
          <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 1rem 0'}}>
            Новое напоминание
          </h3>
          <div style={{display: 'flex', gap: '0.75rem'}}>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Позвонить клиенту..."
              style={{flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.5rem 1rem', color: '#111827', fontSize: '1rem'}}
              onKeyDown={e => e.key === 'Enter' && addReminder()}
            />
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.5rem 1rem', color: '#111827', fontSize: '1rem'}}
            />
            <button
              onClick={addReminder}
              style={{backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500'}}
            >
              + Добавить
            </button>
          </div>
        </div>

        {/* Список напоминаний */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
          {reminders.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center'}}>
              <p style={{fontSize: '2rem', margin: '0 0 0.5rem 0'}}>🔔</p>
              <p style={{color: '#111827', fontWeight: '600', margin: '0 0 0.25rem 0'}}>Напоминаний пока нет</p>
              <p style={{color: '#6b7280', margin: 0}}>Добавь первое напоминание выше</p>
            </div>
          ) : (
            reminders.map((reminder, index) => (
              <div
                key={reminder.id}
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: index < reminders.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: reminder.done ? '#f9fafb' : 'white'
                }}
              >
                {/* Чекбокс */}
                <button
                  onClick={() => toggleDone(reminder.id, reminder.done)}
                  style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${reminder.done ? '#22c55e' : '#d1d5db'}`,
                    backgroundColor: reminder.done ? '#22c55e' : 'white',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {reminder.done && <span style={{color: 'white', fontSize: '0.75rem'}}>✓</span>}
                </button>

                {/* Текст */}
                <div style={{flex: 1}}>
                  <p style={{
                    color: reminder.done ? '#9ca3af' : '#111827',
                    fontWeight: '500',
                    margin: '0 0 0.2rem 0',
                    textDecoration: reminder.done ? 'line-through' : 'none'
                  }}>
                    {reminder.title}
                  </p>
                  {reminder.due_date && (
                    <p style={{color: '#6b7280', fontSize: '0.8rem', margin: 0}}>
                      📅 {new Date(reminder.due_date).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>

                {/* Удалить */}
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  style={{padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem'}}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}