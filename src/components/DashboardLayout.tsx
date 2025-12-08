import type { ReactNode } from "react";
import {Home, User, Folder, Settings } from "lucide-react";

export default function DashboardLayout ({children}:{children: ReactNode}) {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="w-64 bg-white shadow-md p-6 space-y-6 fixed h-full" >
                <h2 className="text-2xl font-bold">Freelancer</h2>
                <nav className="space-y-3">
                    <a className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                        <Home size={20}/> Dashboard
                    </a>
                    <a className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                        <User size={20}/> Profile
                    </a>
                    <a className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                        <Folder size={20}/> Portfolio
                    </a>
                    <a className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                        <Settings size={20}/> Settings
                    </a>
                </nav>
            </div>
            <div className="ml-64 w-full p-8">{children}</div>
        </div>
    );
}