const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 md:h-56 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="flex space-x-2">
          <div className="h-6 bg-slate-200 rounded-full w-16" />
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-10 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );

  const SkeletonRoom = () => (
    <div className="bg-white rounded-xl shadow-md border-2 border-transparent overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto bg-slate-200" />
        <div className="md:w-2/3 p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="flex space-x-2">
            <div className="h-6 bg-slate-200 rounded-full w-20" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
          <div className="h-10 bg-slate-200 rounded w-32" />
        </div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-xl shadow-md border-2 border-transparent overflow-hidden animate-pulse">
      <div className="h-32 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="flex space-x-2">
          <div className="h-5 bg-slate-200 rounded-full w-16" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-24" />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'room':
        return <SkeletonRoom />;
      case 'table':
        return <SkeletonTable />;
      case 'card':
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;

