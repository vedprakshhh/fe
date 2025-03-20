import React from 'react'
import { Upload, Search, Bell, Settings, PlusCircle, FileText, Users, LayoutDashboard, Briefcase, List, Edit, Eye, CheckSquare } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
          {/* Sidebar */}
          <aside className="w-20 bg-white p-4 shadow-md fixed h-full flex flex-col items-center pt-8 space-y-8">
            {[
              { icon: LayoutDashboard, name: "Dashboard" },
              { icon: FileText, name: "Job Descriptions" },
              { icon: Briefcase, name: "Jobs" },
              { icon: Users, name: "Candidates" },
              { icon: List, name: "Reports" },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <item.icon className="w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer" />
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                  {item.name}
                </span>
              </div>
            ))}
          </aside>
          </div>
    )
}

export default Sidebar

