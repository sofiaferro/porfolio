export default function ProjectLoading() {
  return (
    <div className="pt-4 min-h-screen bg-[#f5f5f0] dark:bg-neutral-900">
      <article className="container mx-auto px-4 md:px-6 pt-10 md:pt-20 max-w-5xl">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8" />

        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-300 dark:border-gray-700 pb-10">
          <div className="md:col-span-4">
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-neutral-900/40 p-4 md:p-5 space-y-4">
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="h-10 md:h-14 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="flex gap-4">
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </section>

        <section className="py-10 border-b border-gray-300 dark:border-gray-700">
          <div className="aspect-[16/9] rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700" />
        </section>

        <section className="py-10 border-b border-gray-300 dark:border-gray-700">
          <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
          <div className="space-y-3 max-w-3xl">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
            ))}
          </div>
        </section>

        <section className="py-10 border-b border-gray-300 dark:border-gray-700">
          <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded mb-6" />
          <div className="aspect-[16/9] rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700" />
        </section>

        <div className="py-10 flex justify-between">
          <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </article>
    </div>
  );
}
