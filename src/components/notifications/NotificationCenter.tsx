import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Briefcase, Award, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationService, Notification, NotificationType } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const typeIcons: Record<NotificationType, typeof Bell> = {
  application_status: FileText,
  new_job: Briefcase,
  certificate: Award,
  general: Info,
};

const typeColors: Record<NotificationType, string> = {
  application_status: 'text-blue-500 bg-blue-500/10',
  new_job: 'text-green-500 bg-green-500/10',
  certificate: 'text-purple-500 bg-purple-500/10',
  general: 'text-orange-500 bg-orange-500/10',
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Start real-time simulation
    notificationService.startSimulation();

    return () => {
      unsubscribe();
      notificationService.stopSimulation();
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    notificationService.markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => notificationService.markAllAsRead()}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                      !notification.read && 'bg-primary/5'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={cn('p-2 rounded-full', typeColors[notification.type])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-sm font-medium', !notification.read && 'font-semibold')}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                notificationService.deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
