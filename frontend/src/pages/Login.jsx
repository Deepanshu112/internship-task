import { useForm } from "react-hook-form";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await api.post("/auth/login", data);
    login(res.data.token);
    alert("Login successful");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 
               rounded-xl p-8 shadow-lg
               transition-colors duration-200"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">
            Login
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back. Please sign in.
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm text-neutral-400 mb-1">
            Email
          </label>
          <input
            {...register("email", { required: true })}
            placeholder="you@example.com"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2.5
                   text-white placeholder-neutral-500
                   focus:outline-none focus:border-neutral-600
                   transition-colors"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm text-neutral-400 mb-1">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2.5
                   text-white placeholder-neutral-500
                   focus:outline-none focus:border-neutral-600
                   transition-colors"
          />
        </div>

        {/* Button */}
        <button
          className="w-full py-2.5 rounded-md font-medium
                 bg-white text-black
                 hover:bg-neutral-200
                 active:scale-[0.98]
                 transition-all duration-150"
        >
          Login
        </button>
      </form>
    </div>

  );
};

export default Login;