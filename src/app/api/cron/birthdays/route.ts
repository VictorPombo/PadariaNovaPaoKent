import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cria cliente Supabase de Admin (Service Role) para não depender de sessão do usuário no Cron
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  // Opcional: Proteger a rota para que só o Vercel Cron consiga chamá-la
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + 3) // Aniversariantes daqui a 3 dias
  
  const targetDay = targetDate.getDate()
  const targetMonth = targetDate.getMonth() + 1 // getMonth() é 0-based

  // Buscar aniversariantes
  const { data: birthdays, error } = await supabase
    .from('birthdays')
    .select('*')
    .eq('birth_day', targetDay)
    .eq('birth_month', targetMonth)

  if (error) {
    console.error('Erro ao buscar aniversariantes:', error)
    return NextResponse.json({ error: 'Falha ao buscar aniversariantes' }, { status: 500 })
  }

  if (!birthdays || birthdays.length === 0) {
    return NextResponse.json({ message: 'Nenhum aniversariante encontrado para envio.' })
  }

  const apiToken = process.env.WHATSAPP_API_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  for (const person of birthdays) {
    const messageText = `Oi ${person.full_name.split(' ')[0]}! 🎂 Seu aniversário tá chegando! A Nova Paokent preparou uma surpresa pra você. Responda essa mensagem e garanta seu presente especial!`

    if (apiToken && phoneId) {
      try {
        // Exemplo usando a API oficial da Meta (Cloud API)
        await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: person.whatsapp,
            type: "text",
            text: { body: messageText }
          })
        })
        console.log(`Mensagem enviada para ${person.full_name} (${person.whatsapp})`)
      } catch (err) {
        console.error(`Falha ao enviar mensagem para ${person.whatsapp}`, err)
      }
    } else {
      // Modo Mock: Sem chave de API, apenas loga a intenção
      console.log(`[MOCK WHATSAPP] Mensagem gerada para ${person.whatsapp}: ${messageText}`)
    }
  }

  return NextResponse.json({ 
    success: true, 
    sent_count: birthdays.length,
    message: apiToken ? 'Mensagens enviadas com sucesso.' : 'Modo Mock executado (configure o WHATSAPP_API_TOKEN no .env).'
  })
}
