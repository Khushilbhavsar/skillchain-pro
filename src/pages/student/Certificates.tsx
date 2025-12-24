import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockStudents, mockCertificates } from '@/services/mockData';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Shield, 
  Calendar,
  Hash,
  FileText,
  Clock
} from 'lucide-react';

// Using first student as the logged-in user
const currentStudent = mockStudents[0];
const studentCertificates = mockCertificates.filter(c => c.studentId === currentStudent.id);

// Add some more mock certificates for this student
const allCertificates = [
  ...studentCertificates,
  {
    id: 'cert-extra-1',
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    type: 'skill' as const,
    title: 'Python Programming',
    issuer: 'Coursera',
    issueDate: '2023-03-10',
    transactionHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    blockNumber: 17234567,
    verified: true,
    metadata: { score: '92%', duration: '6 weeks' },
  },
  {
    id: 'cert-extra-2',
    studentId: currentStudent.id,
    studentName: currentStudent.name,
    type: 'achievement' as const,
    title: 'Hackathon Winner - TechFest 2023',
    issuer: 'College Tech Club',
    issueDate: '2023-11-25',
    transactionHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    blockNumber: 18890123,
    verified: true,
    metadata: { position: '1st Place', team: 'CodeCrafters' },
  },
];

export default function StudentCertificates() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Award className="w-5 h-5" />;
      case 'degree': return <FileText className="w-5 h-5" />;
      case 'achievement': return <Shield className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'skill': return 'bg-primary/10 text-primary';
      case 'degree': return 'bg-info/10 text-info';
      case 'achievement': return 'bg-warning/10 text-warning';
      case 'placement': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Certificates</h1>
          <p className="text-muted-foreground">Blockchain-verified credentials and achievements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allCertificates.length}</p>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allCertificates.filter(c => c.verified).length}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allCertificates.filter(c => !c.verified).length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Shield className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentStudent.skills.filter(s => s.verified).length}</p>
                <p className="text-sm text-muted-foreground">Verified Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCertificates.map((cert) => (
          <Card key={cert.id} className="overflow-hidden">
            <div className={`h-2 ${cert.verified ? 'bg-success' : 'bg-warning'}`} />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getTypeColor(cert.type)}`}>
                  {getTypeIcon(cert.type)}
                </div>
                {cert.verified ? (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-warning border-warning/20">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-3">{cert.title}</CardTitle>
              <CardDescription>{cert.issuer}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
              </div>

              {cert.verified && (
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono truncate">{cert.transactionHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Block #{cert.blockNumber}</span>
                  </div>
                </div>
              )}

              {Object.keys(cert.metadata).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(cert.metadata).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              )}

              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Blockchain
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {allCertificates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground">Complete courses and earn certifications to see them here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
