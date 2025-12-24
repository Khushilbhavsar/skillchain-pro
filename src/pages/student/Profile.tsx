import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockStudents } from '@/services/mockData';
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

// Using first student as the logged-in user
const currentStudent = mockStudents[0];

export default function StudentProfile() {
  const placementStatusConfig = {
    placed: { label: 'Placed', color: 'bg-success text-success-foreground' },
    unplaced: { label: 'Seeking Opportunities', color: 'bg-warning text-warning-foreground' },
    in_process: { label: 'In Process', color: 'bg-info text-info-foreground' },
    opted_out: { label: 'Opted Out', color: 'bg-muted text-muted-foreground' },
  };

  const statusConfig = placementStatusConfig[currentStudent.placementStatus];

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
                  {currentStudent.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{currentStudent.name}</h2>
              <p className="text-muted-foreground">{currentStudent.rollNumber}</p>
              <Badge className={`${statusConfig.color} mt-3`}>
                {statusConfig.label}
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{currentStudent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{currentStudent.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{currentStudent.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Batch: {currentStudent.batch}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
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
                  <p className="text-3xl font-bold text-primary">{currentStudent.cgpa.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="text-lg font-semibold">{currentStudent.department}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Batch</p>
                  <p className="text-lg font-semibold">{currentStudent.batch}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Eligible for Placement</p>
                  <div className="flex items-center gap-2">
                    {currentStudent.eligibleForPlacement ? (
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
                Skills & Certifications
              </CardTitle>
              <CardDescription>Your verified and self-declared skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentStudent.skills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant={skill.verified ? 'default' : 'outline'}
                    className={skill.verified ? 'bg-primary' : ''}
                  >
                    {skill.verified && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {skill.name}
                    <span className="ml-1 opacity-70 capitalize">({skill.level})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Placement Info */}
          {currentStudent.placementStatus === 'placed' && currentStudent.placedCompany && (
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
                    <p className="text-xl font-bold">{currentStudent.placedCompany}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background">
                    <p className="text-sm text-muted-foreground mb-1">Package</p>
                    <p className="text-xl font-bold">₹{(currentStudent.placedPackage! / 100000).toFixed(1)} LPA</p>
                  </div>
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
