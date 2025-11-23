
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
  INSURANCE_HOME = 'Seguro Residencial'
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  interest: ProductType;
  value: number;
  score: number; // 0-100 propensity score
  lastInteraction: string;
  notes?: string;
  // New fields for Acesso Master logic
  nextBestAction?: string;
  crossSellOpportunity?: ProductType;
  contemplated?: boolean; // Specific for Consortium logic
}

export interface Task {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'email' | 'system';
  priority: 'high' | 'medium' | 'low';
  dueTime: string;
  relatedLeadId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  products: ProductType[]; // Products they own
  ltv: number; // Lifetime Value
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
  status: 'paid' | 'pending' | 'forecast';
  productType: ProductType;
}

export interface KPI {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  target?: number; // For progress bars
  current?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- NEW TYPES FOR ECOSYSTEM ARCHITECTURE ---

// Open Insurance Standard for Policy Data
export interface Policy {
  id: string;
  insurer: string; // 'Porto Seguro', 'Allianz', etc.
  insurerLogo?: string;
  policyNumber: string;
  productName: string;
  insuredName: string;
  validityStart: string;
  validityEnd: string;
  premium: number;
  status: 'Active' | 'Expiring' | 'Cancelled';
  documents: { name: string; type: 'policy' | 'boleto' | 'card'; url: string }[];
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

// RPA / Scraper Status
export interface ScraperStatus {
  id: string;
  insurer: string;
  status: 'online' | 'error' | 'maintenance' | 'captcha_required';
  lastSync: string;
  successRate: number; // percentage
  errorMessage?: string;
}

// Unified Communication
export interface Conversation {
  id: string;
  channel: 'whatsapp' | 'email';
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'urgent';
  aiDraft?: string; // Suggested response
  contextPolicyId?: string; // Link to a policy for RAG
}

// Governance & Audit
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string; // 'VIEW_POLICY', 'EXPORT_DATA', 'LOGIN_RPA'
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'WARNING';
  ipAddress: string;
}

export enum ViewState {
  DASHBOARD = 'resumo',
  QUOTES = 'cotacoes',
  PROPOSALS = 'propostas',
  PROSPECTING = 'prospeccao',
  POLICIES = 'apolices',
  CLAIMS = 'sinistro',
  COMMISSIONS = 'comissoes',
  FINANCIAL = 'financeiro',
  CLIENTS = 'carteira',
  NEWS = 'novidades',
  SETTINGS = 'settings',
  HELP = 'help'
}
