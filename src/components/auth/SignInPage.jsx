import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/logos/mafutapass-icon-only.svg" 
              alt="MafutaPass Logo" 
              className="w-20 h-20"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="text-6xl">⛽</div>';
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">Welcome Back</h1>
          <p className="text-emerald-600 text-lg">Sign in to manage your fuel.</p>
        </div>
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-2xl rounded-2xl border border-emerald-200 bg-white w-full",
            }
          }}
        />
        <p className="text-center mt-6 text-emerald-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="font-semibold text-emerald-700 hover:text-emerald-800 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
