export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'hr' | 'manager';
  department: string;
  profileImage?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  category: 'documentation' | 'training' | 'setup' | 'approval';
  priority: 'low' | 'medium' | 'high';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  category: 'personal' | 'contract' | 'compliance' | 'training';
}