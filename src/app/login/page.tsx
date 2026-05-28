"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Activity, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Demo Login: Just redirect after a tiny delay for effect
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Brand Header */}
      <div className="absolute top-8 left-8 flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div className="text-white font-bold tracking-widest text-lg">
          EAG-OS <span className="text-slate-500 font-normal">| Equity Afya Gikomba</span>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Mission Control</h1>
            <p className="text-sm text-slate-400">Authenticate to access the ERP</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary transition-all sm:text-sm placeholder:text-slate-600 outline-none"
                  placeholder="admin@eagos.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary transition-all sm:text-sm placeholder:text-slate-600 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex justify-between items-center py-3.5 px-6 rounded-xl shadow-lg text-sm font-semibold text-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span>{isAuthenticating ? "Authenticating..." : "Sign In to Console"}</span>
              {!isAuthenticating && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
          
        </div>

        <p className="text-center text-xs text-slate-600 mt-8 font-mono">
          SYSTEM SECURED • {new Date().getFullYear()} EAG-OS
        </p>
      </div>
    </div>
  );
}
