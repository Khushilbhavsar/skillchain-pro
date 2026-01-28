import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton for stat cards used in dashboards
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for page headers with title and optional action button
 */
export function PageHeaderSkeleton({ showAction = true }: { showAction?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-9 w-40 mb-2" />
        <Skeleton className="h-5 w-56" />
      </div>
      {showAction && <Skeleton className="h-10 w-32" />}
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * Skeleton for card grid (job cards, company cards, etc.)
 */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton for profile/avatar section
 */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-24 w-24 rounded-full mb-4" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-6 w-28" />
    </div>
  );
}

/**
 * Skeleton for list items with avatar
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

/**
 * Skeleton for chart placeholder
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <Skeleton className={`w-full`} style={{ height }} />;
}

/**
 * Skeleton for search/filter bar
 */
export function SearchFilterSkeleton() {
  return <Skeleton className="h-12 w-full" />;
}
