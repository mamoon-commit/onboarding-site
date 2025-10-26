import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, User, FileText, GraduationCap, Settings } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ComponentType<any>;
  completedAt?: string;
}

interface WorkflowProgressProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
}

const WorkflowProgress = ({ currentStep, totalSteps, progressPercentage }: WorkflowProgressProps) => {
  const steps: Step[] = [
    {
      id: '1',
      title: 'Personal Information',
      description: 'Complete your personal details and contact information',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming',
      icon: User,
      completedAt: currentStep > 1 ? '2024-01-15' : undefined
    },
    {
      id: '2',
      title: 'Documentation',
      description: 'Upload required identity and compliance documents',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming',
      icon: FileText,
      completedAt: currentStep > 2 ? '2024-01-18' : undefined
    },
    {
      id: '3',
      title: 'Training Modules',
      description: 'Complete mandatory safety and security training',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming',
      icon: GraduationCap,
      completedAt: currentStep > 3 ? '2024-01-22' : undefined
    },
    {
      id: '4',
      title: 'System Setup',
      description: 'Configure accounts and development environment',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming',
      icon: Settings,
      completedAt: currentStep > 4 ? '2024-01-25' : undefined
    }
  ];

  const getStepIcon = (step: Step) => {
    const IconComponent = step.icon;
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'current':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'upcoming':
        return <IconComponent className="w-5 h-5 text-muted-foreground" />;
      default:
        return <IconComponent className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-success';
      case 'current':
        return 'status-warning';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border';
      default:
        return 'bg-muted text-muted-foreground border';
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Onboarding Progress
        </CardTitle>
        <CardDescription>
          Track your progress through the onboarding process
        </CardDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Step {currentStep} of {totalSteps} • {totalSteps - currentStep} remaining
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
            )}
            
            <div className="flex items-start gap-4">
              {/* Step Icon */}
              <div className={`
                relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                ${step.status === 'completed' 
                  ? 'bg-success border-success' 
                  : step.status === 'current'
                  ? 'bg-warning border-warning'
                  : 'bg-background border-border'
                }
              `}>
                {getStepIcon(step)}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.title}</h4>
                  <Badge className={getStepStatus(step.status)}>
                    {step.status === 'current' ? 'In Progress' : step.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {step.completedAt && (
                  <p className="text-xs text-success">
                    Completed on {new Date(step.completedAt).toLocaleDateString()}
                  </p>
                )}
                {step.status === 'current' && (
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <AlertCircle className="w-3 h-3" />
                    Action required
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkflowProgress;