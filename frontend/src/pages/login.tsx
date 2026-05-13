import { useState } from "react";
import api from '../utils/api'
import { Link } from "react-router-dom";
import { Lock,User } from "lucide-react";

const Login = ()=>{
    const [formData , setFormData] = useState({username:'' , password:''})

    const handleSubmit = async(e: React.SyntheticEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const response = await api.post('/login', formData)
            localStorage.setItem('token', response.data.token)
            window.location.href = '/dashboard'
        } catch (error:any) {
            alert(error.response?.data?.error || "Login failed")
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md space-y-8 ">
                <h2 className="text-3xl font-extrabold text-slate-900 text-center">
                    WELCOME BACK
                </h2>
                <p className="text-sm text-slate-500 text-center">
                    Login to your account
                </p>


                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <span 
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <User size={18} />
                        </span>
                        <input type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Username"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Lock size={18} />
                        </span>
                        <input type="password"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Password"
                        onChange={(e) => setFormData({...formData,password:e.target.value})}
                        />
                    </div>
                        <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >   
                        Login
                        </button>
                        <p className="text-sm text-slate-500 text-center">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </p>
                </form>
                </div>
            </div>
    )
}

export default Login;