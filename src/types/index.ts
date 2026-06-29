export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | 'USER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: string;
}

export interface ClientSupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  clientId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId: string;
  managerId?: string;
  createdAt: string;
}

export interface CRMLeadData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  source?: string;
  notes?: string;
  createdAt: string;
}
