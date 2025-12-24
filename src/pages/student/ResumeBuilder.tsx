import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  User, GraduationCap, Briefcase, Code, FolderGit2, Plus, Trash2, 
  Download, RefreshCw, FileText, Mail, Phone, MapPin, Linkedin, Github, Globe
} from 'lucide-react';
import { resumeService, ResumeData, Education, Experience, Project } from '@/services/resumeService';
import { useToast } from '@/hooks/use-toast';

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>(resumeService.getResume());
  const [newSkill, setNewSkill] = useState('');
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: resumeService.generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: resumeService.generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean | string[]) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: resumeService.generateId(),
      name: '',
      description: '',
      technologies: [],
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current;
      if (!element) throw new Error('Preview not found');

      const opt = {
        margin: 0.5,
        filename: `${resumeData.personalInfo.fullName || 'resume'}_resume.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
      };

      await html2pdf().set(opt).from(element).save();
      toast({
        title: 'Resume Exported',
        description: 'Your resume has been downloaded as PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    setResumeData(resumeService.resetResume());
    toast({ title: 'Resume Reset', description: 'All fields have been cleared.' });
  };

  const handleLoadSample = () => {
    setResumeData(resumeService.loadSampleResume());
    toast({ title: 'Sample Loaded', description: 'Sample resume data has been loaded.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">Create and export your professional resume</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLoadSample}>
            <FileText className="w-4 h-4 mr-2" />
            Load Sample
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleExportPDF} disabled={exporting}>
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal"><User className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="education"><GraduationCap className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="experience"><Briefcase className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="skills"><Code className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="projects"><FolderGit2 className="w-4 h-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Full Name</Label>
                      <Input value={resumeData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} placeholder="John Doe" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} placeholder="john@email.com" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} placeholder="+91 9876543210" />
                    </div>
                    <div className="col-span-2">
                      <Label>Location</Label>
                      <Input value={resumeData.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} placeholder="Bangalore, India" />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input value={resumeData.personalInfo.linkedin || ''} onChange={e => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <Input value={resumeData.personalInfo.github || ''} onChange={e => updatePersonalInfo('github', e.target.value)} placeholder="github.com/johndoe" />
                    </div>
                    <div className="col-span-2">
                      <Label>Summary</Label>
                      <Textarea value={resumeData.personalInfo.summary} onChange={e => updatePersonalInfo('summary', e.target.value)} placeholder="Brief professional summary..." rows={3} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button size="sm" onClick={addEducation}><Plus className="w-4 h-4 mr-1" />Add</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <Label>Institution</Label>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University name" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Degree" />
                        <Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Field of study" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="Start year" />
                        <Input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="End year" />
                        <Input value={edu.gpa || ''} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="GPA" />
                      </div>
                    </div>
                  ))}
                  {resumeData.education.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No education added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Experience</CardTitle>
                  <Button size="sm" onClick={addExperience}><Plus className="w-4 h-4 mr-1" />Add</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <Label>Company</Label>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company name" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Position" />
                        <Input value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} placeholder="Location" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Start date" />
                        <Input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="End date" />
                      </div>
                      <Textarea 
                        value={exp.description.join('\n')} 
                        onChange={e => updateExperience(exp.id, 'description', e.target.value.split('\n'))} 
                        placeholder="Description (one point per line)" 
                        rows={3} 
                      />
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No experience added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyPress={e => e.key === 'Enter' && addSkill()} />
                    <Button onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill}
                        <Trash2 className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                  <Button size="sm" onClick={addProject}><Plus className="w-4 h-4 mr-1" />Add</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <Label>Project Name</Label>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                      <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="Project name" />
                      <Textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="Description" rows={2} />
                      <Input value={proj.technologies.join(', ')} onChange={e => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))} placeholder="Technologies (comma separated)" />
                      <Input value={proj.link || ''} onChange={e => updateProject(proj.id, 'link', e.target.value)} placeholder="Project link" />
                    </div>
                  ))}
                  {resumeData.projects.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No projects added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Your resume as it will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] border rounded-lg">
              <div ref={previewRef} className="p-6 bg-white text-black min-h-full text-sm">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
                  <div className="flex flex-wrap justify-center gap-3 mt-2 text-gray-600 text-xs">
                    {resumeData.personalInfo.email && (
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{resumeData.personalInfo.location}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-1 text-gray-600 text-xs">
                    {resumeData.personalInfo.linkedin && (
                      <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{resumeData.personalInfo.linkedin}</span>
                    )}
                    {resumeData.personalInfo.github && (
                      <span className="flex items-center gap-1"><Github className="w-3 h-3" />{resumeData.personalInfo.github}</span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {resumeData.personalInfo.summary && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <p className="text-gray-700 text-xs">{resumeData.personalInfo.summary}</p>
                  </>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <h2 className="text-sm font-bold text-gray-900 mb-2">EDUCATION</h2>
                    {resumeData.education.map(edu => (
                      <div key={edu.id} className="mb-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">{edu.institution}</span>
                          <span className="text-gray-600">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <div className="text-gray-700">{edu.degree} in {edu.field} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                      </div>
                    ))}
                  </>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <h2 className="text-sm font-bold text-gray-900 mb-2">EXPERIENCE</h2>
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} className="mb-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">{exp.position}</span>
                          <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div className="text-gray-700">{exp.company} | {exp.location}</div>
                        <ul className="list-disc list-inside mt-1 text-gray-700">
                          {exp.description.filter(d => d.trim()).map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <h2 className="text-sm font-bold text-gray-900 mb-2">SKILLS</h2>
                    <p className="text-gray-700">{resumeData.skills.join(' • ')}</p>
                  </>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <h2 className="text-sm font-bold text-gray-900 mb-2">PROJECTS</h2>
                    {resumeData.projects.map(proj => (
                      <div key={proj.id} className="mb-2">
                        <div className="font-semibold text-gray-900">{proj.name}</div>
                        <p className="text-gray-700">{proj.description}</p>
                        {proj.technologies.length > 0 && (
                          <p className="text-gray-600 text-xs">Technologies: {proj.technologies.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
