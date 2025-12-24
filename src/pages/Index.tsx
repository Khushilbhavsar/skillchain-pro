import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Building2, Users, Shield, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types';

const roleConfig: Record<UserRole, { icon: React.ComponentType<any>; title: string; description: string; color: string; path: string }> = {
  tpo: {
    icon: Shield,
    title: 'Admin / TPO',
    description: 'Manage placements, students & companies',
    color: 'bg-primary text-primary-foreground',
    path: '/auth/admin',
  },
  student: {
    icon: GraduationCap,
    title: 'Student',
    description: 'Track applications & skill development',
    color: 'bg-secondary text-secondary-foreground',
    path: '/auth/student',
  },
  company: {
    icon: Building2,
    title: 'Company',
    description: 'Post jobs & manage recruitment',
    color: 'bg-accent text-accent-foreground',
    path: '/auth/company',
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Placement Management System
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            AI-Powered Blockchain-Based Student Placement & Skill Tracking Platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {(Object.keys(roleConfig) as UserRole[]).map((role) => {
            const { icon: Icon, title, description, color, path } = roleConfig[role];
            
            return (
              <Link key={role} to={path}>
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 h-full group">
                  <CardHeader className="text-center pb-2">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} mx-auto mb-2 transition-transform group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg flex items-center justify-center gap-2">
                      {title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="text-center">
          <div className="inline-block p-4 rounded-lg bg-muted/50 max-w-md">
            <p className="text-sm text-muted-foreground">
              Select your role above to access the Sign In / Sign Up portal
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by AI & Blockchain Technology
        </p>
      </div>
    </div>
  );
};

export default Index;
