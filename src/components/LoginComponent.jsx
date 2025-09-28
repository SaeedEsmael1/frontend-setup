import { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

const LoginComponent = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  // Clerk States
  const [clerkError, setClerkError] = useState('');

  const [pwd, setPwd] = useState('');
  const [activePwd, setActivePwd] = useState(false);
  const [validPwd, setValidPwd] = useState(false);

  const [email, setEmail] = useState('');
  const [activeEmail, setActiveEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    const isPwdValid = PWD_REGEX.test(pwd);
    setValidPwd(isPwdValid);
  }, [pwd]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  const signInMutation = useMutation({
    mutationFn: async () => {
      const result = await signIn.create({
        identifier: email,
        password: pwd,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return result;
      }

      throw new Error(
        `Sign-In status: ${result.status}. Please complete all required steps.`,
      );
    },

    onSuccess: (result) => {
      if (result.status === 'complete') {
        navigate('/');
      }
    },
    onError: (err) => {
      setClerkError(err.message || 'Sign-in failed. Please try again.');
    },
  });

  // Event handlers
  const submitHandler = (e) => {
    e.preventDefault();
    if (validPwd && validEmail && isLoaded) {
      console.log('Form data:', {
        pwd,
        email,
      });
      setClerkError(null);
      signInMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create an Account
        </h2>

        {clerkError && (
          <p className="text-red-500 mt-4 text-center">{clerkError}</p>
        )}
        <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              onBlur={() => setActiveEmail(false)}
              onChange={(e) => {
                setEmail(e.target.value);
                setActiveEmail(true);
              }}
              type="email"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
            <p
              className={`${email !== '' && !validEmail ? 'block' : 'hidden'} text-red-500 text-xs mt-1`}
            >
              Invalid email.
            </p>
            <p
              className={`${validEmail && activeEmail ? 'block' : 'hidden'} text-green-400 text-xs mt-1`}
            >
              Valid email.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              autoComplete="new-password"
              onBlur={() => setActivePwd(false)}
              onChange={(e) => {
                setPwd(e.target.value);
                setActivePwd(true);
              }}
              type="password"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
            <p
              className={`${pwd !== '' && !validPwd ? 'block' : 'hidden'} text-red-500 text-xs mt-1`}
            >
              Password must contain at least 8 characters with uppercase,
              lowercase, number, and symbol.
            </p>
            <p
              className={`${validPwd && activePwd ? 'block' : 'hidden'} text-green-400 text-xs mt-1`}
            >
              Valid password.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !validPwd || !validEmail || signInMutation.isPending || !isLoaded
            }
            className={`${
              validPwd && validEmail
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-[#dddddd70] text-black cursor-not-allowed'
            } w-full py-2 mt-4 rounded-xl font-medium shadow-md transition`}
          >
            {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          Dont' have an account?
          <a href="/register" className="text-indigo-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
