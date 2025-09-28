import { useAuth, SignOutButton } from '@clerk/clerk-react';
import LoginComponent from '../components/LoginComponent';
export const Login = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="py-5">
        <div className="container mx-auto">
          <div className="content">
            <div className="min-h-screen flex justify-center items-center">
              <h3>Loading...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isSignedIn) {
    return (
      <div className="py-5">
        <div className="container mx-auto">
          <div className="content">
            <div className="min-h-screen flex justify-center items-center">
              <div>
                <h3 className="text-2xl">
                  You're Already Signed in. <br /> wanna Sign out and sign in
                  again?
                  <SignOutButton className="cursor-pointer text-blue-500 pl-0.5" />
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <LoginComponent />;
};
