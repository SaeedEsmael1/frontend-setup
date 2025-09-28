import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utilities/fetchData';

export const Courses = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchData('courses'),
  });

  return (
    <div className="min-h-screen  py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Available Courses
        </h1>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-xl text-gray dark:text-gray-300">
              Loading courses...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center py-20">
            <p className="text-xl text-red-500">Error: {error.message}</p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data?.map((course) => (
              <div
                key={course.id}
                className="p-6 bg-primary-light dark:bg-primary-dark rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-3 ">{course.name}</h2>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
