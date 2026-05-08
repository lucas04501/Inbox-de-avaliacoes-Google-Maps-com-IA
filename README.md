# ReputaçãoAI - SaaS de Reputação Online com IA

Centralize avaliações do Google Maps, gere respostas inteligentes com Gemini IA e monitore a reputação dos seus estabelecimentos em um único lugar.

## 🚀 Setup Local em 5 Passos

1. **Clone e Instale:**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Configuração do Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com).
   - Execute o script SQL de `supabase/migrations` no painel de SQL Editor.

3. **Variáveis de Ambiente:**
   - Copie `.env.example` para `.env.local`.
   - Preencha com suas chaves do Supabase, Google Places e Gemini API.

4. **Stripe CLI (Opcional para Local):**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Rode o Projeto:**
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack
- **Framework:** Next.js 14/15 (App Router)
- **Database/Auth:** Supabase
- **IA:** Google Gemini (1.5 Flash)
- **Estilos:** Tailwind CSS + shadcn/ui
- **Pagamentos:** Stripe
- **E-mails:** Resend

## 📝 Variáveis Necessárias
Veja o arquivo `.env.example` para a lista completa de chaves necessárias para o deploy.
