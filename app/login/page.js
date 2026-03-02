'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      alert(error.message || 'Erro no login')
      return
    }
    router.replace('/dashboard')
  }

  return (
    <div className="container" style={{display:'grid', minHeight:'100vh', alignItems:'center'}}>
      <div className="card" style={{maxWidth: 420, margin:'0 auto', width:'100%'}}>
        <div className="header">
          <h1 style={{margin:0, fontSize:22}}>Entrar</h1>
          <span className="muted" style={{fontSize:13}}>v0</span>
        </div>

        <p className="muted" style={{marginTop:0}}>Use seu usuário do sistema.</p>

        <form onSubmit={handleLogin} className="row" style={{gap:10}}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="button" disabled={loading || !email || !password} style={{width:'100%'}}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="muted" style={{marginTop:12, fontSize:13}}>
          Dica: crie os usuários no Supabase Auth e use os e-mails “@finance.local”.
        </div>
      </div>
    </div>
  )
}