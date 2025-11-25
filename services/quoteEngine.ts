
import { ProductType, QuoteRequest, QuoteResult, CoverageItem } from '../types';

// Mock delays to simulate external API calls (The "Scalpe" Effect)
// UPDATED: Delay is now influenced by stability
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- CALCULATION LOGIC (Actuarial Simulation) ---

const calculateAutoPremium = (req: QuoteRequest, insurerFactor: number): number => {
    // Base Calculation: FIPE * Risk Factor (Age) * Insurer Factor
    const baseValue = req.itemData.fipeValue || 50000;
    const ageRisk = req.clientData.age < 25 ? 0.08 : req.clientData.age > 60 ? 0.06 : 0.04;
    return baseValue * ageRisk * insurerFactor;
};

const calculateLifePremium = (req: QuoteRequest, insurerFactor: number): number => {
    // Base: Age * Risk Factor per 10k coverage
    const coverage = 100000; // Default base coverage simulation
    const ratePerThousand = req.clientData.age * 0.5; 
    return (coverage / 1000) * ratePerThousand * insurerFactor;
};

const calculateHealthPremium = (req: QuoteRequest, insurerFactor: number): number => {
    // Base: Lives * AgeBracketPrice
    const lives = req.itemData.lives || 1;
    const basePrice = req.clientData.age > 59 ? 1200 : req.clientData.age > 40 ? 600 : 350;
    return basePrice * lives * insurerFactor;
};

const calculateConsortiumInstallment = (req: QuoteRequest, adminFee: number): number => {
    // Letter / Months + Admin Fee
    const letter = req.itemData.creditValue || 100000;
    const months = 180; // Standard term
    const pureInstallment = letter / months;
    return pureInstallment * (1 + adminFee);
};

// --- INSURER ADAPTERS ---

export const AVAILABLE_INSURERS = [
    { id: 'porto', name: 'Porto Seguro', logo: 'P', type: 'general', successRate: 99.5 },
    { id: 'allianz', name: 'Allianz', logo: 'A', type: 'general', successRate: 98.2 },
    { id: 'sulamerica', name: 'SulAmérica', logo: 'S', type: 'health', successRate: 97.0 },
    { id: 'ademicon', name: 'Ademicon', logo: 'Ad', type: 'consortium', successRate: 96.5 },
    { id: 'bradesco', name: 'Bradesco Seguros', logo: 'B', type: 'general', successRate: 85.0 }, // Lower rate due to captchas
];

export const triggerMultiCalculation = async (request: QuoteRequest): Promise<QuoteResult[]> => {
    // Determine which insurers to call based on product type
    let targetInsurers = AVAILABLE_INSURERS;
    
    if (request.productType === ProductType.CONSORTIUM) {
        targetInsurers = AVAILABLE_INSURERS.filter(i => i.id === 'ademicon' || i.id === 'porto');
    } else if (request.productType === ProductType.INSURANCE_HEALTH) {
        targetInsurers = AVAILABLE_INSURERS.filter(i => i.id === 'sulamerica' || i.id === 'bradesco' || i.id === 'porto');
    } else {
        targetInsurers = AVAILABLE_INSURERS.filter(i => i.type === 'general');
    }

    // --- OPTIMIZATION START ---
    // Sort insurers by Success Rate (High -> Low) to prioritize stable connections
    targetInsurers.sort((a, b) => b.successRate - a.successRate);
    // --- OPTIMIZATION END ---

    const promises = targetInsurers.map(async (insurer) => {
        // Optimization: More stable insurers respond faster (simulated)
        // Base delay 1s + variability based on instability
        const instabilityFactor = (100 - insurer.successRate) * 100; // e.g. 99% success = 100ms added, 85% = 1500ms added
        const simulatedDelay = 800 + instabilityFactor + (Math.random() * 500);
        
        await delay(simulatedDelay);

        const proposalNum = `${insurer.id.toUpperCase().substring(0,3)}-${Date.now().toString().slice(-6)}`;
        let premium = 0;
        let coverages: CoverageItem[] = [];
        let installments = [];

        // --- PRODUCT SPECIFIC LOGIC ---
        
        if (request.productType === ProductType.INSURANCE_AUTO) {
            premium = calculateAutoPremium(request, insurer.id === 'porto' ? 1.1 : 0.95); // Porto slightly more expensive premium service
            
            coverages = [
                { name: 'Colisão/Roubo/Incêndio', value: 100, description: '% FIPE', type: 'basic', editable: true },
                { name: 'Danos Materiais', value: 100000, description: 'R$', type: 'basic', editable: true },
                { name: 'Danos Corporais', value: 100000, description: 'R$', type: 'basic', editable: true },
                { name: 'Carro Reserva', value: 7, description: 'Dias', type: 'additional', editable: true },
                { name: 'Vidros Completo', value: 0, description: 'Incluso', type: 'additional', editable: false },
            ];
            
            installments = [
                { count: 1, value: premium },
                { count: 4, value: premium / 4 },
                { count: 10, value: (premium * 1.05) / 10 }, // interest
            ];
        } 
        else if (request.productType === ProductType.INSURANCE_LIFE) {
            premium = calculateLifePremium(request, 1.0);
            
            coverages = [
                { name: 'Morte Qualquer Causa', value: 100000, description: 'R$', type: 'basic', editable: true },
                { name: 'Invalidez por Acidente', value: 100000, description: 'R$', type: 'basic', editable: true },
                { name: 'Auxílio Funeral', value: 5000, description: 'R$', type: 'additional', editable: true },
            ];

            installments = [{ count: 12, value: premium / 12 }]; // Monthly payment usually
        }
        else if (request.productType === ProductType.INSURANCE_HEALTH) {
            premium = calculateHealthPremium(request, insurer.id === 'sulamerica' ? 1.2 : 1.0);
            
            coverages = [
                { name: 'Abrangência', value: 0, description: 'Nacional', type: 'basic', editable: true },
                { name: 'Acomodação', value: 0, description: 'Apartamento', type: 'basic', editable: true },
                { name: 'Coparticipação', value: 30, description: '%', type: 'basic', editable: true },
            ];

            installments = [{ count: 1, value: premium }]; // Monthly
        }
        else if (request.productType === ProductType.CONSORTIUM) {
            const letter = request.itemData.creditValue || 100000;
            const installmentValue = calculateConsortiumInstallment(request, insurer.id === 'porto' ? 0.15 : 0.12); // Admin fee variation
            premium = installmentValue; // For consortium, premium usually refers to monthly installment

            coverages = [
                { name: 'Carta de Crédito', value: letter, description: 'R$', type: 'basic', editable: true },
                { name: 'Taxa de Adm.', value: insurer.id === 'porto' ? 15 : 12, description: '% Total', type: 'basic', editable: false },
                { name: 'Prazo', value: 180, description: 'Meses', type: 'basic', editable: true },
            ];

            installments = [{ count: 180, value: installmentValue }];
        }

        return {
            id: `${insurer.id}-${Date.now()}`,
            insurerId: insurer.id,
            insurerName: insurer.name,
            insurerLogo: insurer.logo,
            productName: `${request.productType} ${insurer.id === 'porto' ? 'Premium' : 'Standard'}`,
            totalPremium: premium,
            installments,
            coverages,
            status: 'success',
            proposalNumber: proposalNum,
            validity: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 5 days
            score: Math.floor(Math.random() * 10) + 1, // AI Score
            // This mimics the PDF generation URL
            pdfUrl: `https://fake-insurer-portal.com/proposal/${proposalNum}.pdf` 
        } as QuoteResult;
    });

    return Promise.all(promises);
};
