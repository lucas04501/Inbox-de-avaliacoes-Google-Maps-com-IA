# ReputaçãoAI — Contexto do Projeto para Gemini CLI

## O que é este produto
SaaS B2B que centraliza avaliações do Google Maps/Places de múltiplos estabelecimentos,
sugere respostas com IA e monitora reputação online.
Cliente ideal: donos de restaurantes, clínicas, salões, franquias com 1–5 unidades.

## Stack técnica
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Banco de dados**: Supabase (PostgreSQL + Auth + Realtime)
- **Pagamentos**: Stripe (checkout + webhooks)
- **IA para respostas**: Google Gemini API (gemini-1.5-flash — gratuito)
- **Email**: Resend
- **Deploy**: Vercel (free tier)
- **Estilo**: Tailwind CSS + shadcn/ui

## Estrutura de pastas
```
src/
  app/
    (auth)/login/          # Página de login
    (auth)/register/       # Página de cadastro
    dashboard/             # Layout autenticado
    dashboard/page.tsx     # Inbox principal de avaliações
    dashboard/locations/   # Gerenciar locais cadastrados
    dashboard/settings/    # Configurações e plano
    api/
      reviews/sync/        # POST — busca novas avaliações do Google
      reviews/reply/       # POST — envia resposta via Google My Business API
      ai/suggest/          # POST — gera sugestão de resposta com Gemini
      webhooks/stripe/     # POST — eventos de pagamento
  components/
    reviews/
      ReviewCard.tsx       # Card de avaliação individual
      ReviewInbox.tsx      # Lista completa com filtros
      ReplyModal.tsx       # Modal para redigir/editar resposta
      StarRating.tsx       # Componente de estrelas
    locations/
      LocationCard.tsx     # Card de um local
      AddLocationModal.tsx # Adicionar novo local
    ui/                    # shadcn/ui components
  lib/
    supabase/
      client.ts            # Client-side Supabase
      server.ts            # Server-side Supabase
      middleware.ts        # Auth middleware
    google/
      places.ts            # Google Places API calls
      mybusiness.ts        # Google My Business API calls
    gemini.ts              # Gemini API — geração de respostas
    stripe.ts              # Stripe helpers
    resend.ts              # Email helpers
  types/
    index.ts               # Tipos globais
```

## Schema do banco (Supabase)
```sql
-- Usuários (gerenciado pelo Supabase Auth)

-- Organizações (cada cliente é uma org)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  plan text default 'free', -- free | starter | pro
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Locais cadastrados
create table locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations not null,
  google_place_id text not null unique,
  name text not null,
  address text,
  google_account_id text, -- para Google My Business API
  last_synced_at timestamptz,
  created_at timestamptz default now()
);

-- Avaliações
create table reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references locations not null,
  google_review_id text not null unique,
  author_name text,
  author_photo_url text,
  rating integer check (rating between 1 and 5),
  text text,
  published_at timestamptz,
  reply_text text,
  replied_at timestamptz,
  status text default 'pending', -- pending | replied | ignored
  ai_suggestion text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table organizations enable row level security;
alter table locations enable row level security;
alter table reviews enable row level security;

create policy "users see own org" on organizations for all using (user_id = auth.uid());
create policy "users see own locations" on locations for all
  using (org_id in (select id from organizations where user_id = auth.uid()));
create policy "users see own reviews" on reviews for all
  using (location_id in (
    select l.id from locations l
    join organizations o on l.org_id = o.id
    where o.user_id = auth.uid()
  ));
```

## Variáveis de ambiente necessárias
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_MY_BUSINESS_CLIENT_ID=
GOOGLE_MY_BUSINESS_CLIENT_SECRET=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

## Regras de código que sempre devo seguir
1. **TypeScript strict** — sem `any`, tipar tudo explicitamente
2. **Server Components por padrão** — só usar `"use client"` quando necessário (interatividade)
3. **Error handling** — toda chamada de API em try/catch com mensagem de erro descritiva
4. **Sem segredos no cliente** — variáveis sem `NEXT_PUBLIC_` ficam só no servidor
5. **RLS no Supabase** — nunca fazer queries sem o contexto de usuário correto
6. **Componentes pequenos** — máximo 150 linhas por arquivo; se passar, quebrar
7. **Comentários só quando necessário** — código limpo não precisa de comentário óbvio

## Planos e preços
| Plano    | Locais | Avaliações/mês | Respostas IA | Preço    |
|----------|--------|----------------|--------------|----------|
| Free     | 1      | 50             | 10           | R$0      |
| Starter  | 3      | 500            | 100          | R$97/mês |
| Pro      | 10     | ilimitado      | ilimitado    | R$247/mês|

## Contexto de negócio
- Cliente paga por **local** gerenciado, não por usuário
- Dor principal: avaliação negativa sem resposta = perda de cliente futuro
- Diferencial: tom de resposta configurável (formal, casual, empático)
- Métrica de sucesso: tempo médio de resposta < 2h

## Fluxo principal do usuário
1. Cadastro → adiciona 1 local grátis → conecta Google
2. Sistema sincroniza avaliações automaticamente
3. Inbox mostra avaliações pendentes, ordenadas por urgência (1–2 estrelas primeiro)
4. Usuário clica em avaliação → IA sugere resposta → usuário edita e publica
5. Dashboard mostra nota média, tendência e tempo médio de resposta
