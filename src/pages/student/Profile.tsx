import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  MapPin,
  Award,
  Edit,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function StudentProfile() {
  const { profile } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await studentService.getCurrentStudent();
        setStudent(data);
      } catch (error) {
        console.error('Error loading student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  const placementStatusConfig: Record<string, { label: string; color: string }> = {
    placed: { label: 'Placed', color: 'bg-success text-success-foreground' },
    unplaced: { label: 'Seeking Opportunities', color: 'bg-warning text-warning-foreground' },
    in_process: { label: 'In Process', color: 'bg-info text-info-foreground' },
    opted_out: { label: 'Opted Out', color: 'bg-muted text-muted-foreground' },
  };

  const statusConfig = placementStatusConfig[student?.placement_status || 'unplaced'];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-6 w-28" />
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Use data from student table, fallback to profile if needed
  const displayName = student?.full_name || profile?.name || 'Student';
  const displayEmail = student?.email || profile?.email || 'N/A';
  const displayPhone = student?.phone || 'Not provided';
  const displayDepartment = student?.branch || profile?.department || 'Not set';
  const displayRollNumber = student?.roll_number || profile?.roll_number || 'N/A';
  const displayBatch = student?.batch || 'Not set';
  const displayCGPA = student?.cgpa || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal and academic information</p>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {displayName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="text-muted-foreground">{displayRollNumber}</p>
              <Badge className={`${statusConfig.color} mt-3`}>
                {statusConfig.label}
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{displayEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{displayPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{displayDepartment}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Batch: {displayBatch}</span>
                </div>
              </div>

              {student?.resume_url ? (
                <Button variant="outline" className="w-full mt-6" asChild>
                  <a href={student.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
              ) : (
                <Button variant="outline" className="w-full mt-6" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  No Resume Uploaded
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">CGPA</p>
                  <p className="text-3xl font-bold text-primary">{displayCGPA.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="text-lg font-semibold">{displayDepartment}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Batch</p>
                  <p className="text-lg font-semibold">{displayBatch}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Eligible for Placement</p>
                  <div className="flex items-center gap-2">
                    {student?.eligible_for_placement ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-lg font-semibold text-success">Yes</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <span className="text-lg font-semibold text-destructive">No</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Skills
              </CardTitle>
              <CardDescription>Your technical skills</CardDescription>
            </CardHeader>
            <CardContent>
              {student?.skills && student.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <Badge key={index} variant="default" className="bg-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills added yet. Update your profile to add skills.</p>
              )}
            </CardContent>
          </Card>

          {/* Placement Info */}
          {student?.placement_status === 'placed' && student.placed_company && (
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  Placement Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-background">
                    <p className="text-sm text-muted-foreground mb-1">Company</p>
                    <p className="text-xl font-bold">{student.placed_company}</p>
                  </div>
                  {student.placed_package && (
                    <div className="p-4 rounded-lg bg-background">
                      <p className="text-sm text-muted-foreground mb-1">Package</p>
                      <p className="text-xl font-bold">₹{(student.placed_package / 100000).toFixed(1)} LPA</p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-background">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className="bg-success text-success-foreground">Offer Accepted</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
