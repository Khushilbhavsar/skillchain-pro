import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { companyService } from '@/services/companyService';
import { jobService, JobFormData } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';

const departments = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
];

const commonSkills = [
  'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'C++', 'SQL',
  'AWS', 'Docker', 'Machine Learning', 'DSA', 'Spring Boot',
];

const locations = [
  'Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Delhi NCR', 'Noida',
];

export default function PostJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    type: 'full_time',
    locations: [],
    packageMin: 0,
    packageMax: 0,
    eligibilityCriteria: {
      minCgpa: 6.0,
      departments: [],
      skills: [],
      backlogs: 0,
    },
    applicationDeadline: '',
    driveDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const company = await companyService.getCurrentCompany();
      await jobService.createJob(company.id, company.name, formData);

      toast({
        title: 'Job Posted Successfully',
        description: 'Your job posting is now live.',
      });

      navigate('/company/jobs');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (
    field: 'locations' | 'departments' | 'skills',
    item: string
  ) => {
    if (field === 'locations') {
      setFormData(prev => ({
        ...prev,
        locations: prev.locations.includes(item)
          ? prev.locations.filter(l => l !== item)
          : [...prev.locations, item],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: {
          ...prev.eligibilityCriteria,
          [field]: prev.eligibilityCriteria[field].includes(item)
            ? prev.eligibilityCriteria[field].filter(d => d !== item)
            : [...prev.eligibilityCriteria[field], item],
        },
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold">Post New Job</h1>
          <p className="text-muted-foreground">Create a new job posting for candidates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter the job details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData(prev => ({ ...prev, type: value as JobFormData['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={4}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="packageMin">Minimum Package (₹) *</Label>
                <Input
                  id="packageMin"
                  type="number"
                  placeholder="e.g., 800000"
                  value={formData.packageMin || ''}
                  onChange={e => setFormData(prev => ({ ...prev, packageMin: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageMax">Maximum Package (₹) *</Label>
                <Input
                  id="packageMax"
                  type="number"
                  placeholder="e.g., 1200000"
                  value={formData.packageMax || ''}
                  onChange={e => setFormData(prev => ({ ...prev, packageMax: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Locations *</Label>
              <div className="flex flex-wrap gap-2">
                {locations.map(loc => (
                  <label
                    key={loc}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      formData.locations.includes(loc)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Checkbox
                      checked={formData.locations.includes(loc)}
                      onCheckedChange={() => toggleArrayItem('locations', loc)}
                      className="hidden"
                    />
                    <span className="text-sm">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>Set requirements for applicants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minCgpa">Minimum CGPA *</Label>
                <Input
                  id="minCgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g., 7.0"
                  value={formData.eligibilityCriteria.minCgpa}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: {
                      ...prev.eligibilityCriteria,
                      minCgpa: Number(e.target.value),
                    },
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backlogs">Max Backlogs Allowed</Label>
                <Input
                  id="backlogs"
                  type="number"
                  min="0"
                  placeholder="e.g., 0"
                  value={formData.eligibilityCriteria.backlogs}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    eligibilityCriteria: {
                      ...prev.eligibilityCriteria,
                      backlogs: Number(e.target.value),
                    },
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Eligible Departments *</Label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <label
                    key={dept}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      formData.eligibilityCriteria.departments.includes(dept)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Checkbox
                      checked={formData.eligibilityCriteria.departments.includes(dept)}
                      onCheckedChange={() => toggleArrayItem('departments', dept)}
                      className="hidden"
                    />
                    <span className="text-sm">{dept}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      formData.eligibilityCriteria.skills.includes(skill)
                        ? 'bg-secondary text-secondary-foreground border-secondary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Checkbox
                      checked={formData.eligibilityCriteria.skills.includes(skill)}
                      onCheckedChange={() => toggleArrayItem('skills', skill)}
                      className="hidden"
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Set application deadline and drive date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={e => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driveDate">Drive Date (Optional)</Label>
                <Input
                  id="driveDate"
                  type="date"
                  value={formData.driveDate || ''}
                  onChange={e => setFormData(prev => ({ ...prev, driveDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
