import LoginForm from '@/components/auth/login-form';
import GoogleSignInButton from '@/components/auth/google-signin-button';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
      <div className="my-4 text-center">OR</div>
      <GoogleSignInButton />
    </div>
  );
} 