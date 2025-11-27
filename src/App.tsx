
import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layout/DashboardLayout"
import Overview from "./components/overview"
import Projects from "./components/projects"
import Profile from "./components/profile"
import Header from "./containers/Header"
import Footer from "./containers/Footer"
import Sidebar from "./containers/Sidebar"


function App() {

  return (
    <>
    <Header/>
    <div className="flex flex-col">
      <Sidebar/>
      <DashboardLayout/>
    </div>
    <Footer/>


    {/* the routes */}
    <Routes>
      <Route path='/' element={<Overview/>}/>
      <Route path="/projects" element={<Projects/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    </>
  )
}

export default App
