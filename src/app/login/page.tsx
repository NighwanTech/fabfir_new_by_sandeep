'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/assets/logo.png';
import { Eye, EyeOff, Loader2, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if user has saved credentials
    try {
      const savedRemember = localStorage.getItem('fabfit_remember_me');
      if (savedRemember === 'true') {
        const savedEmail = localStorage.getItem('fabfit_remember_email');
        const savedPassword = localStorage.getItem('fabfit_remember_password');
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (e) {
      // ignore localStorage restriction in private mode
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          router.push('/admin');
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch (jsonErr) {
        // Non-JSON response e.g. 504 Time-out
      }

      if (!response.ok || !result || !result.success) {
        setError(
          result?.message || 
          (response.status === 504 ? 'Server connection timed out. Please try again in a few moments.' : 'Invalid email or password.')
        );
        setIsLoading(false);
      } else {
        // Save or clear credentials in localStorage based on Remember Me
        try {
          if (rememberMe) {
            localStorage.setItem('fabfit_remember_me', 'true');
            localStorage.setItem('fabfit_remember_email', email);
            localStorage.setItem('fabfit_remember_password', password);
          } else {
            localStorage.removeItem('fabfit_remember_me');
            localStorage.removeItem('fabfit_remember_email');
            localStorage.removeItem('fabfit_remember_password');
          }
        } catch (e) {
          // ignore
        }

        setIsLoading(false);
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-zinc-950 text-zinc-100 font-sans">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <Image
          src="/fabfit.jpeg"
          alt="Fitness Training"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Push harder than yesterday if you want a different tomorrow.
            </h2>
            <p className="text-zinc-400 text-lg">
              Manage your FabFit Performance community, track assessments, and build programs seamlessly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          {/* Logo Name */}
          <div className="flex items-center gap-3 mb-10">
            <Image src={Logo} alt="FabFit Logo" width={48} height={48} className="object-contain" />
            <h1 className="text-2xl font-black tracking-tight text-white">
              Fab<span className="text-amber-500">Fit</span> <span className="font-light text-zinc-400">Performance</span>
            </h1>
          </div>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Please sign in to your admin dashboard.
          </p>

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 items-center text-sm text-amber-400"
                >
                  <svg className="h-5 w-5 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <div>
                <div className="relative group/input">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="peer block w-full rounded-lg border-0 bg-zinc-900/50 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 -top-2 bg-zinc-950 px-1 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-amber-500 peer-focus:bg-zinc-950 font-medium"
                  >
                    Email address
                  </label>
                </div>
              </div>

              <div>
                <div className="relative group/input">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="peer block w-full rounded-lg border-0 bg-zinc-900/50 py-2.5 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 -top-2 bg-zinc-950 px-1 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-amber-500 peer-focus:bg-zinc-950 font-medium"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-zinc-900" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
