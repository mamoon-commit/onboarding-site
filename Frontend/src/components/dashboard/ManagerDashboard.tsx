import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  startDate: string;
  progress: number;
  status: 'active' | 'pending' | 'completed';
  pendingApprovals: number;
}

interface Approval {
  id: string;
  employeeName: string;
  type: 'document' | 'task' | 'timeoff';
  title: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high';
}

const ManagerDashboard = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [stats, setStats] = useState({
    totalTeamMembers: 0,
    activeOnboarding: 0,
    pendingApprovals: 0,
    completedThisMonth: 0,
    averageProgress: 0
  });

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@company.com',
        role: 'Frontend Developer',
        startDate: '2024-01-15',
        progress: 85,
        status: 'active',
        pendingApprovals: 2
      },
      {
        id: '2',
        name: 'Alice Smith',
        email: 'alice@company.com',
        role: 'Backend Developer',
        startDate: '2024-01-10',
        progress: 100,
        status: 'completed',
        pendingApprovals: 0
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@company.com',
        role: 'DevOps Engineer',
        startDate: '2024-01-20',
        progress: 60,
        status: 'active',
        pendingApprovals: 1
      },
      {
        id: '4',
        name: 'Carol Johnson',
        email: 'carol@company.com',
        role: 'QA Engineer',
        startDate: '2024-01-22',
        progress: 35,
        status: 'pending',
        pendingApprovals: 3
      }
    ];

    const mockApprovals: Approval[] = [
      {
        id: '1',
        employeeName: 'John Doe',
        type: 'document',
        title: 'Identity Verification Documents',
        submittedDate: '2024-01-23',
        priority: 'high'
      },
      {
        id: '2',
        employeeName: 'Carol Johnson',
        type: 'task',
        title: 'Development Environment Setup',
        submittedDate: '2024-01-22',
        priority: 'medium'
      },
      {
        id: '3',
        employeeName: 'Bob Wilson',
        type: 'timeoff',
        title: 'Training Leave Request',
        submittedDate: '2024-01-21',
        priority: 'low'
      },
      {
        id: '4',
        employeeName: 'John Doe',
        type: 'document',
        title: 'Security Clearance Form',
        submittedDate: '2024-01-20',
        priority: 'high'
      }
    ];

    setTeamMembers(mockTeamMembers);
    setApprovals(mockApprovals);

    // Calculate stats
    const totalTeamMembers = mockTeamMembers.length;
    const activeOnboarding = mockTeamMembers.filter(member => member.status === 'active').length;
    const pendingApprovals = mockApprovals.length;
    const completedThisMonth = mockTeamMembers.filter(member => member.status === 'completed').length;
    const averageProgress = mockTeamMembers.reduce((acc, member) => acc + member.progress, 0) / totalTeamMembers;

    setStats({
      totalTeamMembers,
      activeOnboarding,
      pendingApprovals,
      completedThisMonth,
      averageProgress
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-success';
      case 'active':
        return 'status-warning';
      case 'pending':
        return 'bg-muted text-muted-foreground border';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return <CheckCircle className="h-4 w-4" />;
      case 'timeoff':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Manager Dashboard
        </h1>
        <p className="text-muted-foreground">
          Oversee your team's onboarding progress and manage approvals.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Under your management
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Onboarding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOnboarding}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Team average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              Onboarding progress of your direct reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.role} • Started {new Date(member.startDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={member.progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground">
                      {member.progress}%
                    </span>
                  </div>
                  {member.pendingApprovals > 0 && (
                    <p className="text-xs text-destructive">
                      {member.pendingApprovals} pending approval{member.pendingApprovals > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View Team Details
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Items requiring your approval or review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {getTypeIcon(approval.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{approval.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        From {approval.employeeName}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(approval.priority)}>
                      {approval.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(approval.submittedDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 px-2 text-xs">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Approvals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common management tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="justify-start h-auto p-4 flex-col items-start gap-2" variant="outline">
              <UserCheck className="h-6 w-6" />
              <span className="font-medium">Review Approvals</span>
              <span className="text-xs text-muted-foreground">
                {stats.pendingApprovals} pending
              </span>
            </Button>
            <Button className="justify-start h-auto p-4 flex-col items-start gap-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span className="font-medium">Team Communication</span>
              <span className="text-xs text-muted-foreground">
                Send updates
              </span>
            </Button>
            <Button className="justify-start h-auto p-4 flex-col items-start gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium">Progress Reports</span>
              <span className="text-xs text-muted-foreground">
                Generate reports
              </span>
            </Button>
            <Button className="justify-start h-auto p-4 flex-col items-start gap-2" variant="outline">
              <Clock className="h-6 w-6" />
              <span className="font-medium">Schedule 1:1s</span>
              <span className="text-xs text-muted-foreground">
                Book meetings
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;