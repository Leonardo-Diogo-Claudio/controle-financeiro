# Controle Financeiro (deploy na Vercel)

## Variáveis de ambiente (Vercel > Project > Settings > Environment Variables)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Deploy
1) Suba este projeto para um repositório no GitHub
2) Na Vercel: Add New Project > Import Git Repository
3) Framework: Next.js (auto)
4) Build Command: `next build` (auto)
5) Output: default

## Rotas
- /login
- /dashboard