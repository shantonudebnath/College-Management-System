export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-14 bg-gray-200 rounded-2xl w-full"></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-60 bg-gray-200 rounded-2xl"></div>
        <div className="h-60 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
