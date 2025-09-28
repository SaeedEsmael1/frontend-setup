import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light dark:bg-primary-dark text-secondary-dark dark:text-secondary-light px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-primary-dark dark:text-primary-light mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray dark:text-gray-300 mb-8">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-secondary-dark dark:bg-secondary-light text-primary-light dark:text-primary-dark rounded-lg font-semibold hover:opacity-90 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
