import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { studentService, StudentData } from '@/services/supabase/studentService';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  phone: z.string().trim().max(15, 'Phone number too long').optional().or(z.literal('')),
  branch: z.string().trim().max(50, 'Branch name too long').optional().or(z.literal('')),
  batch: z.string().trim().max(20, 'Batch too long').optional().or(z.literal('')),
  skills: z.string().trim().max(500, 'Skills list too long').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentData | null;
  onSuccess: () => void;
}

export function EditProfileDialog({ open, onOpenChange, student, onSuccess }: EditProfileDialogProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: student?.full_name || '',
      phone: student?.phone || '',
      branch: student?.branch || '',
      batch: student?.batch || '',
      skills: student?.skills?.join(', ') || '',
    },
  });

  // Reset form when dialog opens with new student data
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && student) {
      form.reset({
        full_name: student.full_name || '',
        phone: student.phone || '',
        branch: student.branch || '',
        batch: student.batch || '',
        skills: student.skills?.join(', ') || '',
      });
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!student?.id) {
      toast({
        title: 'Error',
        description: 'Student profile not found',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Parse skills from comma-separated string
      const skillsArray = values.skills
        ? values.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [];

      const updateData: Partial<StudentData> = {
        full_name: values.full_name,
        phone: values.phone || null,
        branch: values.branch || null,
        batch: values.batch || null,
        skills: skillsArray,
      };

      const result = await studentService.updateStudent(student.id, updateData);

      if (result) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal and academic information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch/Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js)"
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
