import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-10 w-64" />

      <div className="rounded-md border">
        <div className="h-10 border-b px-4 py-2">
          <div className="flex">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="ml-auto h-5 w-24" />
            <Skeleton className="ml-auto h-5 w-24" />
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
