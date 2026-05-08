<div align="center">

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<br /><br />

# ReputaçãoAI

**Gerencie e responda avaliações do Google Maps com Inteligência Artificial.**  
Centralize avaliações de múltiplos estabelecimentos, receba sugestões de resposta geradas por IA e monitore sua reputação online — tudo em um só lugar.

[🔗 Demo ao vivo](https://reputacao-ai.vercel.app) · [📋 Reportar bug](https://github.com/lucas04501/reputacao-ai/issues) · [💡 Sugerir feature](https://github.com/lucas04501/reputacao-ai/issues)

</div>

---

## 📸 Screenshots

> _Em breve — adicione prints do dashboard aqui após o deploy_

---

## ✨ Funcionalidades

- **Inbox centralizado** — todas as avaliações de múltiplos locais em uma única tela, ordenadas por urgência (1–2 estrelas primeiro)
- **Sugestão de resposta com IA** — Gemini 1.5 Flash gera respostas personalizadas com tom configurável (profissional, amigável ou empático)
- **Alertas por email** — notificação automática quando chega avaliação negativa
- **Sincronização automática** — cron job busca novas avaliações a cada 6 horas via Google Places API
- **Multi-local** — gerencie N estabelecimentos com uma única conta
- **Planos e pagamentos** — assinatura recorrente via Stripe com free tier funcional
- **Autenticação segura** — Supabase Auth com Row Level Security no banco

---

## 🚀 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Autenticação | Supabase Auth |
| IA | Google Gemini 1.5 Flash |
| Reviews API | Google Places API |
| Pagamentos | Stripe (Checkout + Webhooks) |
| Email | Resend |
| Estilo | Tailwind CSS + shadcn/ui |
| Deploy | Vercel |

---

## 🗂 Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/          # Login e cadastro
│   ├── dashboard/       # Área autenticada
│   │   ├── page.tsx     # Inbox principal
│   │   ├── locations/   # Gerenciar locais
│   │   └── settings/    # Plano e configurações
│   └── api/
│       ├── ai/suggest/        # Geração de resposta com Gemini
│       ├── reviews/sync/      # Sincronização com Google Places
│       ├── cron/sync/         # Cron automático
│       └── webhooks/stripe/   # Eventos de pagamento
├── components/
│   ├── reviews/         # ReviewCard, ReviewInbox, ReplyModal
│   ├── locations/       # LocationCard, AddLocationModal
│   ├── layout/          # Sidebar, TopBar
│   └── ui/              # shadcn/ui components
└── lib/
    ├── supabase/        # Client, Server, Middleware
    ├── google/          # Places API
    ├── gemini.ts        # Gemini AI
    ├── stripe.ts        # Stripe helpers
    └── resend.ts        # Email helpers
```

---

## ⚙️ Rodando localmente

### Pré-requisitos

- Node.js 20+
- Conta Supabase (free tier)
- Chave Google Places API
- Chave Gemini API (aistudio.google.com)
- Conta Stripe

### 1. Clone o repositório

```bash
git clone https://github.com/lucas04501/reputacao-ai.git
cd reputacao-ai
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com suas chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_PLACES_API_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=
```

### 3. Execute as migrações no Supabase

Copie o conteúdo de `supabase/migrations/` e execute no SQL Editor do Supabase.

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 💳 Planos

| Plano | Locais | Avaliações/mês | Respostas IA | Preço |
|---|---|---|---|---|
| Free | 1 | 50 | 10 | R$0 |
| Starter | 3 | 500 | 100 | R$97/mês |
| Pro | 10 | Ilimitado | Ilimitado | R$247/mês |

---

## 🔒 Segurança

- Row Level Security (RLS) ativo em todas as tabelas — cada usuário acessa apenas seus próprios dados
- Variáveis sensíveis nunca expostas ao cliente
- Webhook Stripe validado por assinatura HMAC
- Endpoint de cron protegido por `CRON_SECRET`

---

## 🗺 Roadmap

- [x] Inbox de avaliações com filtros
- [x] Sugestão de resposta com Gemini AI
- [x] Alertas por email para avaliações negativas
- [x] Sincronização automática via cron
- [x] Planos e pagamentos com Stripe
- [ ] Publicação automática de resposta via Google My Business API
- [ ] Dashboard de analytics (nota média, tendência, tempo de resposta)
- [ ] App mobile (React Native)
- [ ] Integração com TripAdvisor e iFood

---

## 📄 Licença

MIT © [Lucas Pereira](https://github.com/lucas04501)