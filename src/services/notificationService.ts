export type NotificationType = 'application_status' | 'new_job' | 'certificate' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// Mock notifications
let notifications: Notification[] = [
  {
    id: 'n1',
    type: 'application_status',
    title: 'Application Shortlisted',
    message: 'Your application for Software Engineer at Google has been shortlisted!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    link: '/student/applications',
  },
  {
    id: 'n2',
    type: 'new_job',
    title: 'New Job Posted',
    message: 'Amazon has posted a new SDE Intern position. Apply now!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/student/jobs',
  },
  {
    id: 'n3',
    type: 'certificate',
    title: 'Certificate Verified',
    message: 'Your React Developer Certification has been verified on blockchain.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/student/certificates',
  },
  {
    id: 'n4',
    type: 'general',
    title: 'Placement Drive Tomorrow',
    message: 'Reminder: Microsoft placement drive is scheduled for tomorrow at 10 AM.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Simulated new notifications for real-time effect
const simulatedNotifications: Omit<Notification, 'id' | 'createdAt' | 'read'>[] = [
  {
    type: 'new_job',
    title: 'New Job Alert',
    message: 'TCS has posted a System Engineer position matching your profile.',
    link: '/student/jobs',
  },
  {
    type: 'application_status',
    title: 'Interview Scheduled',
    message: 'Your interview with Infosys has been scheduled for next week.',
    link: '/student/applications',
  },
  {
    type: 'certificate',
    title: 'New Certificate Issued',
    message: 'Your Python certification has been recorded on blockchain.',
    link: '/student/certificates',
  },
  {
    type: 'general',
    title: 'Profile Update Required',
    message: 'Please update your resume before the upcoming placement season.',
  },
];

type NotificationListener = (notifications: Notification[]) => void;
const listeners: NotificationListener[] = [];
let simulationInterval: NodeJS.Timeout | null = null;

export const notificationService = {
  // Get all notifications
  getNotifications(): Notification[] {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get unread count
  getUnreadCount(): number {
    return notifications.filter(n => !n.read).length;
  },

  // Mark as read
  markAsRead(id: string): void {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  },

  // Mark all as read
  markAllAsRead(): void {
    notifications.forEach(n => (n.read = true));
    this.notifyListeners();
  },

  // Delete notification
  deleteNotification(id: string): void {
    notifications = notifications.filter(n => n.id !== id);
    this.notifyListeners();
  },

  // Subscribe to changes
  subscribe(listener: NotificationListener): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  // Notify all listeners
  notifyListeners(): void {
    const current = this.getNotifications();
    listeners.forEach(listener => listener(current));
  },

  // Start real-time simulation
  startSimulation(): void {
    if (simulationInterval) return;

    simulationInterval = setInterval(() => {
      const randomNotif = simulatedNotifications[Math.floor(Math.random() * simulatedNotifications.length)];
      const newNotification: Notification = {
        ...randomNotif,
        id: `n${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      notifications.unshift(newNotification);
      this.notifyListeners();
    }, 15000); // New notification every 15 seconds
  },

  // Stop simulation
  stopSimulation(): void {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
  },
};
