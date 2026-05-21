const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-[#e8e2d8]/60 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="bg-white/70 rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
    <Skeleton className="aspect-square rounded-none rounded-t-2xl" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-2.5 w-16 rounded-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3.5 w-20" />
    </div>
  </div>
);

export const KPISkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
    <Skeleton className="w-10 h-10 rounded-xl mb-3" />
    <Skeleton className="h-7 w-24 mb-2" />
    <Skeleton className="h-3 w-16 mb-1" />
    <Skeleton className="h-2.5 w-20" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 px-5 py-3.5 border-b border-[#e5e0d8]/30">
    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-2.5 w-20" />
    </div>
    <Skeleton className="h-5 w-16 rounded-full" />
    <Skeleton className="h-4 w-14" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-[200px] w-full rounded-xl" />
  </div>
);

export default Skeleton;
