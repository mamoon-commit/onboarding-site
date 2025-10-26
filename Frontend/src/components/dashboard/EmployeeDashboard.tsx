import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingTask, Document } from '@/types/auth';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockTasks: OnboardingTask[] = [
      {
        id: '1',
        title: 'Complete Personal Information Form',
        description: 'Fill out your personal details and emergency contacts',
        status: 'completed',
        dueDate: '2024-01-15',
        category: 'documentation',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Upload Identity Documents',
        description: 'Provide copies of ID, passport, and proof of address',
        status: 'in-progress',
        dueDate: '2024-01-20',
        category: 'documentation',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Complete Safety Training Module',
        description: 'Online safety and security training course',
        status: 'pending',
        dueDate: '2024-01-25',
        category: 'training',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Set up Development Environment',
        description: 'Install required software and development tools',
        status: 'pending',
        dueDate: '2024-01-30',
        category: 'setup',
        priority: 'medium'
      }
    ];

    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Employment Contract.pdf',
        type: 'pdf',
        size: 2048576,
        uploadDate: '2024-01-10',
        status: 'approved',
        category: 'contract'
      },
      {
        id: '2',
        name: 'ID_Copy.jpg',
        type: 'image',
        size: 1024576,
        uploadDate: '2024-01-12',
        status: 'pending',
        category: 'personal'
      }
    ];

    setTasks(mockTasks);
    setDocuments(mockDocuments);
    
    // Calculate progress
    const completedTasks = mockTasks.filter(task => task.status === 'completed').length;
    const progress = (completedTasks / mockTasks.length) * 100;
    setProgressPercentage(progress);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-success';
      case 'in-progress':
        return 'bg-warning-light text-warning border border-warning/20';
      case 'pending':
        return 'bg-muted text-muted-foreground border';
      case 'overdue':
        return 'status-error';
      default:
        return 'bg-muted text-muted-foreground border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'status-error';
      case 'medium':
        return 'status-warning';
      case 'low':
        return 'status-success';
      default:
        return 'bg-muted text-muted-foreground border';
    }
  };

  const upcomingTasks = tasks.filter(task => task.status !== 'completed').slice(0, 3);
  const recentDocuments = documents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's your onboarding progress and upcoming tasks.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks awaiting your action
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              {documents.filter(d => d.status === 'approved').length} approved,{' '}
              {documents.filter(d => d.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Left</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Until onboarding completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              Complete these tasks to continue your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Documents
            </CardTitle>
            <CardDescription>
              Your uploaded documents and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{doc.name}</h4>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;