import Link from 'next/link'
import { 
  CheckCircle2, 
  Inbox, 
  MapPin, 
  Settings, 
  Sparkles, 
  Star, 
  Zap, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Building2,
  Stethoscope,
  Utensils
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
      {/* Header/Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ReputaçãoAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-green-600 transition-colors">Como funciona</a>
            <a href="#precos" className="hover:text-green-600 transition-colors">Preços</a>
            <Link href="/login" className="hover:text-green-600 transition-colors">Login</Link>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
              <Sparkles className="h-3 w-3" />
              Potencializado por Gemini 1.5 Flash
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              Responda avaliações do Google <span className="text-green-600">10x mais rápido</span> com IA
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Centralize todos os seus locais, receba alertas de avaliações negativas e gere respostas personalizadas em segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-lg px-8 h-14">
                <Link href="/register">Começar Grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
                <Link href="#como-funciona">Ver como funciona</Link>
              </Button>
            </div>

            {/* Mockup Dashboard */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden p-2">
                <div className="bg-gray-50 rounded-lg border border-gray-100 flex aspect-video sm:aspect-[16/9] overflow-hidden">
                  <aside className="w-16 sm:w-48 border-r border-gray-200 bg-white p-4 hidden sm:block">
                    <div className="space-y-4">
                      <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-8 w-full bg-green-600 rounded"></div>
                        <div className="h-8 w-full bg-gray-50 rounded"></div>
                        <div className="h-8 w-full bg-gray-50 rounded"></div>
                      </div>
                    </div>
                  </aside>
                  <main className="flex-1 p-4 sm:p-8 bg-white flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-32 bg-gray-100 rounded"></div>
                      <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-50 rounded-lg border border-gray-100"></div>)}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-4">
                      <div className="h-40 w-full bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                          <div className="h-4 w-48 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problema Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 italic text-gray-500">O problema</h2>
              <h3 className="text-4xl font-extrabold tracking-tight">Cuidar da sua reputação online é difícil</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Avaliações sem resposta",
                  desc: "Clientes sentem-se ignorados. Uma avaliação negativa sem resposta afasta 40% dos novos clientes.",
                  icon: MessageSquare,
                  color: "text-red-500"
                },
                {
                  title: "Tom inconsistente",
                  desc: "Responder cada avaliação manualmente leva tempo e o tom de voz varia entre funcionários.",
                  icon: Zap,
                  color: "text-orange-500"
                },
                {
                  title: "Múltiplos locais",
                  desc: "É impossível gerenciar 5 ou 10 locais ao mesmo tempo entrando em cada painel do Google.",
                  icon: MapPin,
                  color: "text-blue-500"
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`mb-6 p-3 rounded-xl bg-gray-50 inline-block ${item.color}`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4">Simples e Eficiente</h2>
              <h3 className="text-4xl font-extrabold tracking-tight">Como o ReputaçãoAI funciona</h3>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Conecte seus locais",
                    desc: "Adicione seu estabelecimento através do Google Places. Sincronizamos todas as avaliações passadas e novas automaticamente.",
                    icon: MapPin
                  },
                  {
                    step: "02",
                    title: "IA analisa e sugere",
                    desc: "Para cada nova avaliação, nossa IA analisa o sentimento e sugere a resposta perfeita baseada no tom que você escolher.",
                    icon: Sparkles
                  },
                  {
                    step: "03",
                    title: "Edite e publique",
                    desc: "Revise a sugestão, faça ajustes se necessário e publique diretamente no Google sem sair da nossa plataforma.",
                    icon: CheckCircle2
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-8 items-start md:items-center p-8 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="text-5xl font-black text-gray-100 md:w-24 shrink-0">{item.step}</div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <item.icon className="h-6 w-6 text-green-600" />
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 bg-green-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold">Quem já usa o ReputaçãoAI</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Ricardo Santos",
                  role: "Proprietário de Clínica",
                  text: "Antes eu levava horas no fim de semana respondendo pacientes. Agora resolvo tudo em 10 minutos durante o café. A IA é impressionante.",
                  icon: Stethoscope
                },
                {
                  name: "Julia Almeida",
                  role: "Dona de Restaurante",
                  text: "Gerencio 3 unidades e era impossível acompanhar. O alerta de avaliações negativas me salvou de várias crises antes que escalassem.",
                  icon: Utensils
                },
                {
                  name: "Marcos Oliveira",
                  role: "Franqueado",
                  text: "A consistência nas respostas melhorou muito nossa nota no Google Maps. O retorno sobre o investimento foi imediato.",
                  icon: Building2
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-white" />)}
                  </div>
                  <p className="text-lg italic mb-6 leading-relaxed">"{item.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-green-100">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-extrabold tracking-tight mb-4">Planos que crescem com você</h3>
              <p className="text-gray-500 text-lg">Teste grátis por 7 dias em qualquer plano pago.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
              {[
                {
                  name: "Free",
                  price: "R$0",
                  features: ["1 Local", "50 Avaliações/mês", "10 Respostas IA", "Relatórios básicos"],
                  button: "Começar Grátis",
                  primary: false
                },
                {
                  name: "Starter",
                  price: "R$97",
                  features: ["3 Locais", "500 Avaliações/mês", "100 Respostas IA", "Alertas por Email", "Suporte em 24h"],
                  button: "Escolher Starter",
                  primary: true,
                  tag: "Mais Popular"
                },
                {
                  name: "Pro",
                  price: "R$247",
                  features: ["10 Locais", "Avaliações Ilimitadas", "Respostas IA Ilimitadas", "Suporte Prioritário", "Webhooks"],
                  button: "Escolher Pro",
                  primary: false
                }
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "bg-white p-8 rounded-2xl border flex flex-col relative overflow-hidden",
                  plan.primary ? "border-green-600 shadow-xl scale-105 z-10 py-12" : "border-gray-100 shadow-sm"
                )}>
                  {plan.tag && (
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg">
                      {plan.tag}
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="text-4xl font-black mb-6">
                    {plan.price}<span className="text-sm font-normal text-gray-500">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={plan.primary ? "default" : "outline"} className={cn(
                    "w-full h-12 font-bold",
                    plan.primary ? "bg-green-600 hover:bg-green-700" : ""
                  )}>
                    <Link href="/register">{plan.button}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl font-extrabold tracking-tight mb-6">Pronto para recuperar o controle da sua reputação?</h3>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já economizam tempo e encantam clientes com o ReputaçãoAI.
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-12 h-16">
              <Link href="/register">Começar agora mesmo</Link>
            </Button>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Setup em 2 minutos</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight">ReputaçãoAI</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 ReputaçãoAI. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-green-600 transition-colors">Termos</Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-green-600 transition-colors">Privacidade</Link>
              <Link href="mailto:suporte@reputacaoai.com.br" className="text-sm text-gray-400 hover:text-green-600 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
