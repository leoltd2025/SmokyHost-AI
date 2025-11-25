
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GUESTS = 'GUESTS',
  PRICING = 'PRICING',
  LISTINGS = 'LISTINGS',
  OPERATIONS = 'OPERATIONS',
  MARKETING = 'MARKETING',
  FINANCIALS = 'FINANCIALS'
}

export interface Property {
  id: string;
  name: string;
  address: string;
  status: 'Active' | 'Maintenance' | 'Cleaning';
  occupancyRate: number;
  nextCheckIn: string;
  imgUrl: string;
}

export interface Metric {
  label: string;
  value: string;
  change: number; // Percentage
  trend: 'up' | 'down' | 'neutral';
  description?: string; // For Beginner Mode
}

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'ai' | 'host';
  text: string;
  timestamp: Date;
}

export interface PricingData {
  date: string;
  price: number;
  occupancy: number;
  event?: string;
}

export interface OperationTask {
  id: string;
  propertyId: string;
  propertyName: string;
  taskName: string;
  type: 'Cleaning' | 'Maintenance' | 'Inspection';
  status: 'Unassigned' | 'Scheduled' | 'In Progress' | 'Completed';
  dueDate: string;
  assignee?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface SmartDevice {
  id: string;
  propertyId: string;
  type: 'Thermostat' | 'Lock' | 'LeakSensor' | 'NoiseMonitor';
  name: string;
  status: 'Online' | 'Offline' | 'Alert';
  value: string; 
  batteryLevel: number;
  lastUpdate: Date;
}

export interface ROIProjection {
  scenarioName: string;
  purchasePrice: number;
  estimatedMonthlyRevenue: number;
  monthlyExpenses: number;
  cashOnCashReturn: number;
  netAnnualIncome: number;
}
