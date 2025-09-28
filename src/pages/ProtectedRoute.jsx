import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="py-5">
        <div className="container mx-auto">
          <div className="content">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="py-5">
        <div className="container mx-auto">
          <div className="content">
            <h3>
              Opps, it looks like you're not signed in or even not registered!
              please register first:{' '}
              <Link to={'/register'} className="text-blue-500">
                Register
              </Link>
              <p>
                Already have an account? please Log in:{' '}
                <Link to={'/login'} className="text-blue-500">
                  Log in
                </Link>
              </p>
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
