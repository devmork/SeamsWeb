//LAST WORKING IMPLEMENTATION (TUE MAR 24 7:55PM)
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import { Link } from "react-router-dom"

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false)

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
//         {/* Header */}
//         <div className="text-center mb-7">
//           <h1 className="text-2xl font-bold text-slate-800">Welcome Back!</h1>
//         </div>

//         <form className="space-y-5">
//           {/* Email */}
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-700">Email</label>
//             <Input placeholder="Enter your Email" type="email" className="h-10" />
//           </div>

//           {/* Password */}
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-700">Password</label>
//             <div className="relative">
//               <Input
//                 placeholder="Enter Password"
//                 type={showPassword ? "text" : "password"}
//                 className="h-10 pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((s) => !s)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                   </svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Remember me & Forgot password */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
//               <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-blue-600" />
//               Remember me
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
//               Forgot password?
//             </a>
//           </div>

//           {/* Sign in button */}
//           <Button
//             type="submit"
//             className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
//           >
//             Sign in
//           </Button>
//         </form>

//         {/* Sign up link */}
//         <p className="text-center text-sm text-slate-500 mt-6">
//           Don't have an account?{" "}
//           <Link 
//             to="/register"
//             className="text-blue-600 font-semibold hover:underline">
//               Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logIn } from "@/service/authService"
import type { LogInData } from "@/types/user.type"
import { jwtDecode } from "jwt-decode"

// Role-based route mapping - all lowercase for consistency
const roleRoutes: Record<string, string> = {
  officer: "/officer",
  student: "/student",
  admin: "/officer",
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  const navigate = useNavigate()

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  // Function to extract role from JWT token and convert to lowercase
  const extractRoleFromToken = (token: string): string | null => {
    try {
      const decoded = jwtDecode<any>(token)
      console.log("Decoded JWT:", decoded)
      
      // Extract role from the specific claim in your JWT
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      
      console.log("Extracted role:", role)
      // Return role in lowercase
      return role ? role.toLowerCase() : null
    } catch (error) {
      console.error("Failed to decode JWT:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const loginData: LogInData = { email, password }
      const response = await logIn(loginData)
      
      // Check if login was successful
      if (response.token && response.user) {
        // Store authentication data
        localStorage.setItem("token", response.token)
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }
        
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.user))
        
        // Extract role from JWT token (already lowercase)
        const userRole = extractRoleFromToken(response.token)
        
        console.log("User role from JWT (lowercase):", userRole)
        
        // Role-based routing - use the lowercase role
        const redirectPath = userRole && roleRoutes[userRole] 
          ? roleRoutes[userRole] 
          : "/student"
        
        console.log("Redirecting to:", redirectPath)
        navigate(redirectPath, { replace: true })
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err: any) {
      // Handle different error scenarios
      if (err.response?.status === 401) {
        setError("Invalid email or password")
      } else if (err.response?.status === 400) {
        setError("Please check your email and password format")
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Something went wrong. Please try again later.")
      }
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back!</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input 
              placeholder="Enter your Email" 
              type="email" 
              className="h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Input
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                className="h-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Remember me
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign in button */}
          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link 
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}