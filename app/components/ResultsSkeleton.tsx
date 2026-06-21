export default function ResultsSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#ece4d6] md:grid-cols-[240px_1fr_230px]">
          <div className="h-[200px] animate-pulse bg-[#e9e1d2]" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-2/3 animate-pulse rounded bg-[#e9e1d2]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[#eee7da]" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 animate-pulse rounded bg-[#eee7da]" />
              <div className="h-6 w-24 animate-pulse rounded bg-[#eee7da]" />
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-2 bg-[#fbf7ef] p-6">
            <div className="h-8 w-24 animate-pulse rounded bg-[#e9e1d2]" />
            <div className="h-10 w-full animate-pulse rounded-full bg-[#e9e1d2]" />
          </div>
        </div>
      ))}
    </div>
  );
}
