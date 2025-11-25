

export enum LeadStatus {
  NEW = 'Novo',
  CONTACTED = 'Contatado',
  PROPOSAL = 'Em Proposta',
  WON = 'Vendido',
  LOST = 'Perdido'
}

export enum ProductType {
  CONSORTIUM = 'Consórcio',
  INSURANCE_AUTO = 'Seguro Auto',
  INSURANCE_LIFE = 'Seguro Vida',
  INSURANCE_HOME = 'Seguro Residencial',
  INSURANCE_HEALTH = 'Seguro Saúde' // New
}

// --- QUOTE ENGINE TYPES ---

export interface CoverageItem {
  name: string;
  value: number; // Cobertura (R$)
  description?: string;
  type: 'basic' | 'additional';
  editable: boolean;
}

export interface QuoteRequest {
  leadId: string;
  productType: ProductType;
  clientData: {
    name: string;
    age: number;
    cpf: string;
    zipCode: string;
  };
  itemData: {
    model?: string; // Auto
    fipeValue?: number; // Auto
    propertyValue?: number; // Home
    creditValue?: number; // Consortium
    lives?: number; // Health
    occupation?: string; // Life
  };
}

export interface QuoteResult {
  id: string;
  insurerId: string;
  insurerName: string;
  insurerLogo: string; // URL or Initials
  productName: string;
  totalPremium: number; // Preço total
  installments: { count: number; value: number }[];
  coverages: CoverageItem[];
  status: 'calculating' | 'success' | 'error';
  proposalNumber?: string; // Gerado pela seguradora
  pdfUrl?: string; // Link para download
  validity: string;
  score: number; // 0-10 cost benefit
}

// --- EXISTING TYPES ---

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  interest: ProductType;
  value: number;
  score: number;
  lastInteraction: string;
  notes?: string;
  nextBestAction?: string;
  crossSellOpportunity?: ProductType;
  contemplated?: boolean;
  routingReason?: string;
  tags?: string[];
  // Linked data for quoting
  cpf?: string;
  vehicleModel?: string;
  // External Integration Data
  origin?: 'manual' | 'web_life' | 'web_consortium';
  preCalculatedQuotes?: QuoteResult[]; // Top 3 options ready
  aiDraftMessage?: string; // Auto-generated sales pitch
  readyToPropose?: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'system';
  priority: 'high' | 'medium' | 'low';
  dueTime: string;
  relatedLeadId?: string;
}

export interface FinancialInstallment {
  number: number;
  total: number;
  dueDate: string;
  status: 'paid' | 'open' | 'overdue';
  commissionValue: number;
  commissionStatus: 'received' | 'projected';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  products: ProductType[];
  ltv: number;
  clientSince: string;
  status: 'active' | 'risk' | 'churned';
  lastContact: string;
  nextRenewalDate?: string;
  nextRenewalProduct?: ProductType;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'commission_received' | 'commission_future' | 'bonus';
  status: 'paid' | 'pending' | 'forecast' | 'overdue';
  productType: ProductType;
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  target?: number;
  current?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AssemblyHistory {
  month: string;
  winningBidPct: number;
  averageBidPct: number;
  clientBidPct?: number;
  result: 'contemplated' | 'lost' | 'skipped';
}

export interface ConsortiumSpecifics {
  group: string;
  quota: string;
  administrator: string;
  letterValue: number;
  balanceDue: number;
  nextAssemblyDate: string;
  suggestedBidPct?: number;
  assemblyHistory: AssemblyHistory[];
}

export interface Policy {
  id: string;
  insurer: string;
  insurerLogo?: string;
  policyNumber: string;
  productName: string;
  insuredName: string;
  validityStart: string;
  validityEnd: string;
  premium: number;
  status: 'Active' | 'Expiring' | 'Cancelled';
  documents: { name: string; type: 'policy' | 'boleto' | 'card'; url: string }[];
  installments?: FinancialInstallment[];
  consortiumDetails?: ConsortiumSpecifics;
}

export interface Claim {
  id: string;
  policyNumber: string;
  insurer: string;
  insuredName: string;
  incidentDate: string;
  status: 'Open' | 'Analyzing' | 'Paid' | 'Denied';
  description: string;
  value?: number;
}

export interface ScraperStatus {
  id: string;
  insurer: string;
  status: 'online' | 'error' | 'maintenance' | 'captcha_required';
  lastSync: string;
  successRate: number;
  errorMessage?: string;
  currentAction?: string;
}

export interface Conversation {
  id: string;
  channel: 'whatsapp' | 'email';
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'urgent';
  aiDraft?: string;
  contextPolicyId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'WARNING';
  ipAddress: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  type: 'GEO' | 'SKILL' | 'ROUND_ROBIN' | 'PERFORMANCE';
  isActive: boolean;
  parameters: string;
  priority: number;
}

export enum ViewState {
  DASHBOARD = 'resumo',
  QUOTES = 'cotacoes',
  PROPOSAL_MANAGER = 'gerenciador_proposta', // New View
  PROPOSALS = 'propostas',
  PROSPECTING = 'prospeccao',
  POLICIES = 'apolices',
  CLAIMS = 'sinistro',
  COMMISSIONS = 'comissoes',
  FINANCIAL = 'financeiro',
  CLIENTS = 'carteira',
  NEWS = 'comunicacao',
  SETTINGS = 'settings',
  HELP = 'help'
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  type: 'renewal' | 'claim' | 'message' | 'sale' | 'alert' | 'system';
  title: string;
  date: string;
  description: string;
  iconBg?: string;
  iconColor?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Cônjuge' | 'Filho(a)' | 'Pai/Mãe' | 'Sócio(a)' | 'Irmão(ã)';
  age?: number;
  products: ProductType[];
  opportunity?: ProductType;
  opportunityScore?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionLink?: ViewState;
}

export interface UserProfile {
  name: string;
  role: 'Master' | 'Corretor' | 'Gerente';
  avatar: string;
  email: string;
}
