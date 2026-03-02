'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

function daysUntil(dateStr) {
  const today = new Date()
  const d = new Date(dateStr + 'T00:00:00')
  const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
  return diff
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [debts, setDebts] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.replace('/login')
        return
      }
      setUser(data.user)

      // carrega dívidas abertas para mostrar alertas simples (base)
      const { data: rows } = await supabase
        .from('debts')
        .select('id, descricao, valor_total, vencimento, status')
        .eq('status', 'aberta')
        .order('vencimento', { ascending: true })

      setDebts(rows || [])
    })()
  }, [router])

  const alerts = useMemo(() => {
    return (debts || []).map(d => {
      const du = daysUntil(d.vencimento)
      let level = 'ok'
      let label = `Vence em ${du} dia(s)`
      if (du < 0) { level='late'; label = `Vencida há ${Math.abs(du)} dia(s)` }
      else if (du <= 3) { level='red'; label = `Vence em ${du} dia(s)` }
      else if (du <= 7) { level='orange'; label = `Vence em ${du} dia(s)` }
      return { ...d, du, level, label }
    })
  }, [debts])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="container" style={{paddingTop:18}}>
      <div className="header">
        <div>
          <h1 style={{margin:'0 0 4px 0', fontSize:22}}>Dashboard</h1>
          <div className="muted" style={{fontSize:13}}>{user?.email || ''}</div>
        </div>
        <button className="button" onClick={logout} style={{background:'#111'}}>Sair</button>
      </div>

      <div className="card">
        <h2 style={{marginTop:0, fontSize:18}}>Alertas de Dívidas (base)</h2>
        {alerts.length === 0 ? (
          <div className="muted">Nenhuma dívida aberta encontrada.</div>
        ) : (
          <div style={{display:'grid', gap:10}}>
            {alerts.map(a => (
              <div key={a.id} style={{
                padding:12,
                borderRadius:12,
                border:'1px solid #e6e7ee',
                display:'flex',
                justifyContent:'space-between',
                gap:12
              }}>
                <div>
                  <div style={{fontWeight:600}}>{a.descricao}</div>
                  <div className="muted" style={{fontSize:13}}>Vencimento: {a.vencimento}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:700}}>R$ {Number(a.valor_total).toFixed(2)}</div>
                  <div className="muted" style={{fontSize:13}}>{a.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="muted" style={{marginTop:12, fontSize:13}}>
          Próximo passo: telas completas (entradas/saídas/dívidas/relatórios com gráficos).
        </div>
      </div>
    </div>
  )
}