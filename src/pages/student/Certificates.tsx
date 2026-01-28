import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { certificateServiceDB, CertificateData } from '@/services/supabase/certificateService';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await certificateServiceDB.getStudentCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const getTypeIcon = (verified: boolean) => {
    return verified ? <Shield className="w-5 h-5" /> : <Award className="w-5 h-5" />;
  };

  const getTypeColor = (verified: boolean) => {
    return verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning';
  };

  const verifiedCount = certificates.filter(c => c.verified).length;
  const pendingCount = certificates.filter(c => !c.verified).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{certificates.length}</p>
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
                <p className="text-2xl font-bold">{verifiedCount}</p>
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
                <p className="text-2xl font-bold">{pendingCount}</p>
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
                <p className="text-2xl font-bold">{verifiedCount}</p>
                <p className="text-sm text-muted-foreground">Blockchain Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className={`h-2 ${cert.verified ? 'bg-success' : 'bg-warning'}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${getTypeColor(cert.verified)}`}>
                    {getTypeIcon(cert.verified)}
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
                {cert.issue_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                  </div>
                )}

                {cert.verified && cert.blockchain_hash && (
                  <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono truncate">{cert.blockchain_hash.slice(0, 20)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>Blockchain Verified</span>
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
