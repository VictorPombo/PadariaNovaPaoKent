import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A0F 50%, #0F0F0F 100%)',
            color: '#FAF6EF',
            fontFamily: 'var(--font-inter)',
          }}
        >
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
