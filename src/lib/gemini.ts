import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateReplySuggestion(reviewText: string, rating: number, businessName: string, tone: 'formal' | 'casual' | 'empathetic' = 'empathetic') {
  const prompt = `
    Você é um assistente de reputação online para o estabelecimento "${businessName}".
    Gere uma resposta curta, profissional e ${tone} para a seguinte avaliação de um cliente:
    
    Estrelas: ${rating}/5
    Avaliação: "${reviewText}"
    
    A resposta deve ser em português do Brasil, focar em agradecer (se positivo) ou pedir desculpas e oferecer solução (se negativo).
    Não use nomes genéricos de funcionários.
  `

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Error generating Gemini suggestion:', error)
    return null
  }
}
