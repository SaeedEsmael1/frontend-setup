import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

const RegisterComponent = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [clerkError, setClerkError] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const firstNameRef = useRef();
  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  // Form states (keeping your existing structure)
  const [firstName, setFirstName] = useState('');
  const [activeFirstName, setActiveFirstName] = useState(false);
  const [validFirstName, setValidFirstName] = useState(false);

  const [secondName, setSecondName] = useState('');
  const [activeSecondName, setActiveSecondName] = useState(false);
  const [validSecondName, setValidSecondtName] = useState(false);

  const [pwd, setPwd] = useState('');
  const [activePwd, setActivePwd] = useState(false);
  const [validPwd, setValidPwd] = useState(false);

  const [confirmPwd, setConfirmPwd] = useState('');
  const [activeConfirmPwd, setActiveConfirmPwd] = useState(false);
  const [validConfirmPwd, setValidConfirmPwd] = useState(false);

  const [email, setEmail] = useState('');
  const [activeEmail, setActiveEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  // Validation effects (keeping your existing logic)
  useEffect(() => {
    const isFirstNameValid = USER_REGEX.test(firstName);
    setValidFirstName(isFirstNameValid);
  }, [firstName]);

  useEffect(() => {
    const isSecondNameValid = USER_REGEX.test(secondName);
    setValidSecondtName(isSecondNameValid);
  }, [secondName]);

  useEffect(() => {
    const isPwdValid = PWD_REGEX.test(pwd);
    setValidPwd(isPwdValid);

    const isConfirmValid = PWD_REGEX.test(confirmPwd) && pwd === confirmPwd;
    setValidConfirmPwd(isConfirmValid);
  }, [pwd, confirmPwd]);

  useEffect(() => {
    const isEmailValid = EMAIL_REGEX.test(email);
    setValidEmail(isEmailValid);
  }, [email]);

  // Event handlers (keeping your existing structure)
  const firstNameChangeHandler = (e) => {
    setFirstName(e.target.value);
    setActiveFirstName(true);
  };
  const SecondNameChangeHandler = (e) => {
    setSecondName(e.target.value);
    setActiveSecondName(true);
  };
  const pwdChangeHandler = (e) => {
    setPwd(e.target.value);
    setActivePwd(true);
  };
  const confirmPwdChangeHandler = (e) => {
    setConfirmPwd(e.target.value);
    setActiveConfirmPwd(true);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    setActiveEmail(true);
  };

  const firstNameBlureHandler = () => setActiveFirstName(false);
  const SecondNameBlureHandler = () => setActiveSecondName(false);
  const pwdBlureHandler = () => setActivePwd(false);
  const confirmPwdBlureHandler = () => setActiveConfirmPwd(false);
  const emailBlureHandler = () => setActiveEmail(false);

  // Fixed sign-up mutation
  const signUpMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting sign-up process...');

      const result = await signUp.create({
        firstName,
        lastName: secondName,
        emailAddress: email,
        password: pwd,
      });

      console.log('Sign-up result:', result);
      console.log('Status:', result.status);
      console.log('Missing requirements:', result.missingFields);
      console.log('Unverified fields:', result.unverifiedFields);

      // Handle different statuses properly
      if (result.status === 'complete') {
        console.log('Sign-up complete, activating session...');
        await setActive({ session: result.createdSessionId });
        return result;
      }

      if (result.status === 'missing_requirements') {
        console.log('Missing requirements, preparing verification...');
        // Check if email verification is needed
        if (result.unverifiedFields?.includes('email_address')) {
          await signUp.prepareEmailAddressVerification({
            strategy: 'email_code',
          });
          setPendingVerification(true);
          return { status: 'verification_needed' };
        }
        throw new Error(
          `Missing requirements: ${result.missingFields?.join(', ')}`,
        );
      }

      // Handle any other status
      throw new Error(
        `Sign-up status: ${result.status}. Please complete all required steps.`,
      );
    },

    onSuccess: (result) => {
      if (result.status !== 'verification_needed') {
        console.log('Sign-up successful, navigating...');
        navigate('/');
      }
    },

    onError: (err) => {
      console.error('Sign-up error:', err);
      // Handle Clerk-specific errors
      if (err.errors) {
        const clerkErrors = err.errors.map((error) => {
          switch (error.code) {
            case 'form_identifier_exists':
              return 'An account with this email already exists.';
            case 'form_password_pwned':
              return 'This password has been compromised. Please choose a different one.';
            case 'form_password_too_short':
              return 'Password is too short.';
            case 'form_username_invalid':
              return 'Invalid username format.';
            default:
              return error.message || 'Unknown error occurred.';
          }
        });
        setClerkError(clerkErrors.join(' '));
      } else {
        setClerkError(err.message || 'Sign-up failed. Please try again.');
      }
    },
  });

  // Verification mutation
  const verifyMutation = useMutation({
    mutationFn: async (code) => {
      console.log('Attempting verification with code:', code);

      const result = await signUp.attemptEmailAddressVerification({ code });

      console.log('Verification result:', result);

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return result;
      } else {
        throw new Error(
          'Verification failed. Please check your code and try again.',
        );
      }
    },

    onSuccess: () => {
      console.log('Verification successful!');
      navigate('/');
    },

    onError: (err) => {
      console.error('Verification error:', err);
      setClerkError(err.message || 'Verification failed. Please try again.');
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      validFirstName &&
      validSecondName &&
      validPwd &&
      validConfirmPwd &&
      validEmail &&
      isLoaded
    ) {
      console.log('Form data:', {
        firstName,
        secondName,
        pwd,
        confirmPwd,
        email,
      });
      setClerkError(null);
      signUpMutation.mutate();
    }
  };

  const handleVerification = (e) => {
    e.preventDefault();
    if (verificationCode.length >= 4) {
      setClerkError(null);
      verifyMutation.mutate(verificationCode);
    }
  };

  // Show verification form if pending
  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Check Your Email
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            We sent a verification code to <strong>{email}</strong>
          </p>

          {clerkError && (
            <p className="text-red-500 mt-4 text-center">{clerkError}</p>
          )}

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 text-center text-lg tracking-wider"
                placeholder="Enter code"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={verificationCode.length < 4 || verifyMutation.isPending}
              className={`w-full py-2 rounded-xl font-medium shadow-md transition ${
                verificationCode.length >= 4
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-[#dddddd70] text-black cursor-not-allowed'
              }`}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <button
            onClick={() => {
              setPendingVerification(false);
              setVerificationCode('');
              setClerkError(null);
            }}
            className="w-full mt-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create an Account
        </h2>

        {clerkError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-400 text-sm">
              {clerkError}
            </p>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              ref={firstNameRef}
              onBlur={firstNameBlureHandler}
              onChange={firstNameChangeHandler}
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your first name"
            />
            <p
              className={`${firstName !== '' && !validFirstName ? 'block' : 'hidden'} text-red-500 text-xs mt-1`}
            >
              Invalid name.
            </p>
            <p
              className={`${validFirstName && activeFirstName ? 'block' : 'hidden'} text-green-400 text-xs mt-1`}
            >
              Valid name.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              onBlur={SecondNameBlureHandler}
              onChange={SecondNameChangeHandler}
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your last name"
            />
            <p
              className={`${secondName !== '' && !validSecondName ? 'block' : 'hidden'} text-red-500 text-xs mt-1`}
            >
              Invalid name.
            </p>
            <p
              className={`${validSecondName && activeSecondName ? 'block' : 'hidden'} text-green-400 text-xs mt-1`}
            >
              Valid name.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              onBlur={emailBlureHandler}
              onChange={emailChangeHandler}
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

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              autoComplete="new-password"
              onBlur={pwdBlureHandler}
              onChange={pwdChangeHandler}
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

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              autoComplete="new-password"
              onBlur={confirmPwdBlureHandler}
              onChange={confirmPwdChangeHandler}
              type="password"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Re-enter your password"
            />
            <p
              className={`${confirmPwd !== '' && !validConfirmPwd ? 'block' : 'hidden'} text-red-500 text-xs mt-1`}
            >
              Passwords must match.
            </p>
            <p
              className={`${validConfirmPwd && activeConfirmPwd ? 'block' : 'hidden'} text-green-400 text-xs mt-1`}
            >
              Passwords match.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !validFirstName ||
              !validSecondName ||
              !validPwd ||
              !validConfirmPwd ||
              !validEmail ||
              signUpMutation.isPending ||
              !isLoaded
            }
            className={`
              ${
                validFirstName &&
                validSecondName &&
                validPwd &&
                validConfirmPwd &&
                validEmail
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-[#dddddd70] text-black cursor-not-allowed'
              } w-full py-2 mt-4 rounded-xl font-medium shadow-md transition`}
          >
            {signUpMutation.isPending
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
export default RegisterComponent;
