'use client';
import { signInWithGoogle } from '@/lib/auth';
import Image from 'next/image';

export default function GoogleSignInButton() {
  return (
    <button
      onClick={signInWithGoogle}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
    >
      <Image 
        width={24}
        height={24}
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google logo"
        className="w-6 h-6"
        priority
      />
      <span>Continue with Google</span>
    </button>
  );
} 