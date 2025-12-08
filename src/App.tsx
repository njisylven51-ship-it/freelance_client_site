
import Signup from "./components/ui/form/sign-up";
import { BrowserRouter,  Route, Navigate, Routes } from "react-router-dom";

import Login from "./components/ui/form/login";
import { Toaster } from "sonner";
import FreelancerDashboard from "./components/FreelancerDashboard";


function App() {
  return (
    <BrowserRouter >
    <Toaster position="top-center" richColors/>
    <div className="flex justify-center items-center  bg-[#f9fafb]">
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/FreelancerDashboard" element={<FreelancerDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    </BrowserRouter>

  )
}

export default App