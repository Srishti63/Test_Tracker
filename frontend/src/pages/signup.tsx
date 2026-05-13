import { useState } from "react";
import api from "../utils/api";
import {useNavigate, Link} from 'react-router-dom';
import { UserPlus, Lock, User } from "lucide-react";

const Signup = ()=>{
    const [formData , setFormData] =useState({ username: '' , password : ''})
    const navigate = useNavigate();

    const handleSubmit = async(e: React.SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            await api.post('/signup', formData)
            navigate('/login')
        } catch (error:any) {
            alert(error.response?.data?.error || "Signup failed")
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 flex items-center justify-center rounded-xl mb-4">
            <UserPlus className="text-blue-600" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Track your progress and ace your exams</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Username"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register Now
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
