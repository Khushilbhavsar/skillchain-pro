import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Building2, Users, Shield } from 'lucide-react';

const roleConfig: Record<UserRole, { icon: React.ComponentType<any>; title: string; description: string; color: string }> = {
  tpo: {
    icon: Shield,
    title: 'TPO / Admin',
    description: 'Manage placements, students & companies',
    color: 'bg-primary text-primary-foreground',
  },
  student: {
    icon: GraduationCap,
    title: 'Student',
    description: 'Track applications & skill development',
    color: 'bg-secondary text-secondary-foreground',
  },
  company: {
    icon: Building2,
    title: 'Company',
    description: 'Post jobs & manage recruitment',
    color: 'bg-accent text-accent-foreground',
  },
};

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole);
      navigate(selectedRole === 'tpo' ? '/admin' : `/${selectedRole}`);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Pre-fill demo credentials
    const demoEmails: Record<UserRole, string> = {
      tpo: 'tpo@college.edu',
      student: 'student@college.edu',
      company: 'hr@techcorp.com',
    };
    setEmail(demoEmails[role]);
    setPassword('demo123');
  };

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
            const { icon: Icon, title, description, color } = roleConfig[role];
            const isSelected = selectedRole === role;
            
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} mx-auto mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login Form */}
        {selectedRole && (
          <Card className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Sign In as {roleConfig[selectedRole].title}</CardTitle>
              <CardDescription>
                Demo mode - credentials are pre-filled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              
              <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  🔐 Mock Authentication Mode - Click any role to login
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by AI & Blockchain Technology
        </p>
      </div>
    </div>
  );
};

export default Index;
