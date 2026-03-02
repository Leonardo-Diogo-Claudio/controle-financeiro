import './globals.css'

export const metadata = {
  title: 'Controle Financeiro',
  description: 'Gestão de gastos e dívidas'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}