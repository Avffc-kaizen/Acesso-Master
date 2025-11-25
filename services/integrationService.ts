
import { Lead, LeadStatus, ProductType, QuoteRequest } from '../types';
import { triggerMultiCalculation } from './quoteEngine';
import { generateComparisonPitch } from './geminiService';

// Simulating Data Incoming from:
// Life System: https://aistudio.google.com/apps/drive/1GuQy6C59ve1HBmalsX8x0MDG550qht_1
// Consortium System: https://aistudio.google.com/apps/drive/15mWckNa2a1xweIYYPvsD8kmfF8vXCori

const MOCK_WEB_LEADS = [
    {
        name: "Juliana Martins (Web)",
        email: "juliana.martins@email.com",
        phone: "(11) 99876-5432",
        age: 32,
        product: ProductType.INSURANCE_LIFE,
        inputValue: 500000, // Capital Segurado
        origin: 'web_life'
    },
    {
        name: "Pedro Henrique (Web)",
        email: "pedro.cons@email.com",
        phone: "(41) 98888-5678",
        age: 45,
        product: ProductType.CONSORTIUM,
        inputValue: 300000, // Carta de Crédito
        origin: 'web_consortium'
    }
];

export const processIncomingWebLead = async (rawLead: any): Promise<Lead> => {
    // 1. Create Lead Object
    const newLead: Lead = {
        id: `web_${Date.now()}`,
        name: rawLead.name,
        email: rawLead.email,
        phone: rawLead.phone,
        status: LeadStatus.NEW,
        interest: rawLead.product,
        value: rawLead.inputValue,
        score: 95, // High intent confirmed by Web form
        lastInteraction: 'Agora (Automação)',
        origin: rawLead.origin as any,
        notes: `Lead captado via Sistema de ${rawLead.product === ProductType.CONSORTIUM ? 'Consórcio' : 'Vida'}.`,
        tags: ['Origem: Web', 'Prioridade', 'Calculado'],
        routingReason: 'Integração API'
    };

    // 2. Prepare Quote Request for Engine
    const quoteReq: QuoteRequest = {
        leadId: newLead.id,
        productType: newLead.interest,
        clientData: {
            name: newLead.name,
            age: rawLead.age,
            cpf: '000.000.000-00', // Placeholder until collected
            zipCode: '00000-000'
        },
        itemData: {
            creditValue: newLead.interest === ProductType.CONSORTIUM ? newLead.value : undefined,
            lives: 1, // Default
            occupation: 'Profissional Liberal' // Default simulation
        }
    };

    // 3. Trigger Calculation Engine (Automated Background Process)
    try {
        console.log(`[RPA] Iniciando cálculo multi-seguradora para ${newLead.name}...`);
        const allQuotes = await triggerMultiCalculation(quoteReq);
        
        // 4. Filter Top 3 Best Options (Logic: Highest Score)
        const top3Quotes = allQuotes
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        // 5. Attach to Lead
        newLead.preCalculatedQuotes = top3Quotes;
        newLead.readyToPropose = true;
        
        // 6. Generate AI Draft Message (Automatic)
        console.log(`[AI] Gerando pitch de vendas comparativo...`);
        newLead.aiDraftMessage = await generateComparisonPitch(newLead.name, newLead.interest, top3Quotes);
        
        newLead.notes += ` [RPA: 3 Propostas Geradas + Pitch IA pronto]`;
        
    } catch (error) {
        console.error("Falha no cálculo automático:", error);
        newLead.notes += " [Erro ao calcular propostas automáticas]";
    }

    return newLead;
};

export const simulateWebhookArrival = async (): Promise<Lead> => {
    // Always prioritize Juliana for the Demo
    const raw = MOCK_WEB_LEADS[0]; 
    
    // Add timestamp to ID to allow multiple simulations
    const uniqueRaw = {
        ...raw,
        name: raw.name // Keep name constant for demo consistency
    };
    
    return await processIncomingWebLead(uniqueRaw);
};
