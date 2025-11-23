
import { GoogleGenAI } from "@google/genai";
import { Lead, Policy } from "../types";

// Initialize Gemini Client
// CRITICAL: Use process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é a "Inteligência Mestre" do ecossistema Acesso Master. 
Sua missão é orquestrar o sucesso do corretor de franquias multiproduto.
Você não é apenas um chatbot, é um estrategista de vendas.

Seus Princípios:
1. **Visão Integral**: Um cliente de consórcio é sempre um prospect para seguro (proteção de dívida ou bem).
2. **Clareza e Humanidade**: Explique termos técnicos (lance embutido, sinistro, prêmio) de forma simples.
3. **Foco na Ação**: Sempre sugira o próximo passo (Next Best Action).

Cenários Chave:
- Se o cliente foi contemplado no consórcio -> Sugira Seguro Residencial/Auto ou Seguro Prestamista.
- Se o cliente tem família nova -> Sugira Seguro de Vida.
- Se o cliente quer investir -> Sugira Consórcio como planejamento financeiro.
`;

export const sendMessageToGemini = async (message: string, history: string[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    
    const result = await chat.sendMessage({ message });
    return result.text || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Desculpe, estou conectando aos servidores da Matriz. Tente em instantes.";
  }
};

export const analyzeLeadOpportunity = async (lead: Lead): Promise<string> => {
  try {
    const prompt = `
      Analise este lead sob a ótica do ecossistema Acesso Master.
      
      DADOS DO CLIENTE:
      Nome: ${lead.name}
      Interesse Principal: ${lead.interest}
      Status: ${lead.status}
      Valor: R$ ${lead.value}
      Score Propensão: ${lead.score}
      Contemplado: ${lead.contemplated ? 'SIM' : 'NÃO'}
      Notas: ${lead.notes || 'Sem notas'}

      TAREFA:
      1. Gere um "Script de Abordagem" curto e empático (máx 2 linhas).
      2. Identifique a oportunidade de Cross-Sell mais óbvia (ex: Se contemplado -> Seguro do Bem).
      3. Explique em 1 frase por que esse lead é prioritário.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Análise indisponível.";
  } catch (error) {
    console.error("Error analyzing lead:", error);
    return "Não foi possível analisar o lead neste momento.";
  }
};

export const getQuickStatsInsight = async (leads: Lead[]): Promise<string> => {
    try {
        const totalValue = leads.reduce((acc, curr) => acc + curr.value, 0);
        const contemplated = leads.filter(l => l.contemplated).length;
        
        const prompt = `
            Eu sou um corretor Acesso Master.
            Pipeline Total: R$ ${totalValue}.
            Clientes Contemplados (Ouro para Cross-sell): ${contemplated}.
            
            Gere uma frase de 'Bom dia' estratégica e motivacional, lembrando-me de focar no cross-sell dos contemplados se houver algum.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite-latest',
            contents: prompt,
        });
        
        return response.text || "Vamos transformar oportunidades em patrimônio hoje!";
    } catch (error) {
        return "Foque nos clientes com maior potencial de cross-sell hoje!";
    }
};

// New function for Communication Hub (Unified Inbox)
export const generateDraftResponse = async (customerMessage: string, policyContext?: Policy): Promise<string> => {
  try {
    let contextInfo = "Sem dados de apólice vinculados.";
    if (policyContext) {
      contextInfo = `
        Apólice: ${policyContext.insurer} - ${policyContext.productName}
        Vigência: ${policyContext.validityStart} até ${policyContext.validityEnd}
        Status: ${policyContext.status}
        Link Boleto: [Link do Boleto]
      `;
    }

    const prompt = `
      Atue como um assistente de atendimento da Corretora Master.
      Mensagem do Cliente: "${customerMessage}"
      Contexto do Sistema (Dados Reais): ${contextInfo}

      TAREFA:
      Escreva uma resposta curta, profissional e humana para o WhatsApp.
      Se o cliente pediu boleto e a apólice está ativa, diga que segue em anexo.
      Se a apólice venceu, sugira renovação.
      Não invente dados.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Olá, vou verificar sua solicitação agora mesmo.";
  } catch (error) {
    console.error("Error generating draft:", error);
    return "Olá, recebi sua mensagem. Um momento por favor.";
  }
};
