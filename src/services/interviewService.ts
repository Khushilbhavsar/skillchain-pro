export interface InterviewSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  companyId: string;
  companyName: string;
  jobId: string;
  jobTitle: string;
  location: string;
  type: 'technical' | 'hr' | 'group_discussion' | 'aptitude';
  capacity: number;
  assignedStudents: string[];
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  companyName: string;
  date: string;
  description: string;
  rounds: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Mock placement drives
const placementDrives: PlacementDrive[] = [
  {
    id: 'pd1',
    companyId: 'c1',
    companyName: 'Google',
    date: '2024-03-25',
    description: 'Campus recruitment drive for Software Engineers',
    rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    status: 'upcoming',
  },
  {
    id: 'pd2',
    companyId: 'c2',
    companyName: 'Amazon',
    date: '2024-03-10',
    description: 'SDE Intern hiring drive',
    rounds: ['Coding Assessment', 'Technical Interview 1', 'Technical Interview 2'],
    status: 'ongoing',
  },
  {
    id: 'pd3',
    companyId: 'c3',
    companyName: 'Microsoft',
    date: '2024-04-05',
    description: 'Product Manager and SDE hiring',
    rounds: ['Aptitude Test', 'Group Discussion', 'Technical Interview', 'HR Interview'],
    status: 'upcoming',
  },
  {
    id: 'pd4',
    companyId: 'c4',
    companyName: 'Infosys',
    date: '2024-04-10',
    description: 'Mass hiring for System Engineers',
    rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'],
    status: 'upcoming',
  },
];

// Mock interview slots
let interviewSlots: InterviewSlot[] = [
  {
    id: 'is1',
    date: '2024-03-25',
    startTime: '09:00',
    endTime: '09:30',
    companyId: 'c1',
    companyName: 'Google',
    jobId: 'j1',
    jobTitle: 'Software Engineer',
    location: 'Conference Room A',
    type: 'technical',
    capacity: 1,
    assignedStudents: ['1'],
  },
  {
    id: 'is2',
    date: '2024-03-25',
    startTime: '09:30',
    endTime: '10:00',
    companyId: 'c1',
    companyName: 'Google',
    jobId: 'j1',
    jobTitle: 'Software Engineer',
    location: 'Conference Room A',
    type: 'technical',
    capacity: 1,
    assignedStudents: ['2'],
  },
  {
    id: 'is3',
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '10:30',
    companyId: 'c1',
    companyName: 'Google',
    jobId: 'j1',
    jobTitle: 'Software Engineer',
    location: 'Conference Room A',
    type: 'technical',
    capacity: 1,
    assignedStudents: [],
  },
  {
    id: 'is4',
    date: '2024-03-10',
    startTime: '11:00',
    endTime: '11:45',
    companyId: 'c2',
    companyName: 'Amazon',
    jobId: 'j2',
    jobTitle: 'SDE Intern',
    location: 'Online - Teams',
    type: 'technical',
    capacity: 1,
    assignedStudents: ['3'],
  },
  {
    id: 'is5',
    date: '2024-04-05',
    startTime: '14:00',
    endTime: '15:00',
    companyId: 'c3',
    companyName: 'Microsoft',
    jobId: 'j3',
    jobTitle: 'Product Manager',
    location: 'Seminar Hall',
    type: 'group_discussion',
    capacity: 10,
    assignedStudents: ['4', '6'],
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const interviewService = {
  // Get all placement drives
  async getPlacementDrives(): Promise<PlacementDrive[]> {
    await delay(200);
    return [...placementDrives];
  },

  // Get drives for a specific month
  async getDrivesByMonth(year: number, month: number): Promise<PlacementDrive[]> {
    await delay(200);
    return placementDrives.filter(drive => {
      const driveDate = new Date(drive.date);
      return driveDate.getFullYear() === year && driveDate.getMonth() === month;
    });
  },

  // Get all interview slots
  async getInterviewSlots(): Promise<InterviewSlot[]> {
    await delay(200);
    return [...interviewSlots];
  },

  // Get slots for a specific date
  async getSlotsByDate(date: string): Promise<InterviewSlot[]> {
    await delay(200);
    return interviewSlots.filter(slot => slot.date === date);
  },

  // Get slots for a company
  async getSlotsByCompany(companyId: string): Promise<InterviewSlot[]> {
    await delay(200);
    return interviewSlots.filter(slot => slot.companyId === companyId);
  },

  // Create new interview slot
  async createSlot(slot: Omit<InterviewSlot, 'id' | 'assignedStudents'>): Promise<InterviewSlot> {
    await delay(300);
    const newSlot: InterviewSlot = {
      ...slot,
      id: `is${Date.now()}`,
      assignedStudents: [],
    };
    interviewSlots.push(newSlot);
    return newSlot;
  },

  // Assign student to slot
  async assignStudent(slotId: string, studentId: string): Promise<InterviewSlot> {
    await delay(300);
    const slot = interviewSlots.find(s => s.id === slotId);
    if (!slot) throw new Error('Slot not found');
    if (slot.assignedStudents.length >= slot.capacity) {
      throw new Error('Slot is full');
    }
    if (slot.assignedStudents.includes(studentId)) {
      throw new Error('Student already assigned');
    }
    slot.assignedStudents.push(studentId);
    return slot;
  },

  // Remove student from slot
  async removeStudent(slotId: string, studentId: string): Promise<InterviewSlot> {
    await delay(300);
    const slot = interviewSlots.find(s => s.id === slotId);
    if (!slot) throw new Error('Slot not found');
    slot.assignedStudents = slot.assignedStudents.filter(id => id !== studentId);
    return slot;
  },

  // Delete slot
  async deleteSlot(slotId: string): Promise<void> {
    await delay(300);
    interviewSlots = interviewSlots.filter(s => s.id !== slotId);
  },

  // Get calendar events (formatted for calendar view)
  async getCalendarEvents(year: number, month: number) {
    await delay(200);
    const events: { date: string; events: { type: 'drive' | 'interview'; data: PlacementDrive | InterviewSlot }[] }[] = [];
    
    // Add drives
    placementDrives.forEach(drive => {
      const driveDate = new Date(drive.date);
      if (driveDate.getFullYear() === year && driveDate.getMonth() === month) {
        const existing = events.find(e => e.date === drive.date);
        if (existing) {
          existing.events.push({ type: 'drive', data: drive });
        } else {
          events.push({ date: drive.date, events: [{ type: 'drive', data: drive }] });
        }
      }
    });

    // Add interview slots
    interviewSlots.forEach(slot => {
      const slotDate = new Date(slot.date);
      if (slotDate.getFullYear() === year && slotDate.getMonth() === month) {
        const existing = events.find(e => e.date === slot.date);
        if (existing) {
          existing.events.push({ type: 'interview', data: slot });
        } else {
          events.push({ date: slot.date, events: [{ type: 'interview', data: slot }] });
        }
      }
    });

    return events;
  },
};
