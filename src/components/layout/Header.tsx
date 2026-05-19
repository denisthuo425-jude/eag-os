"use client";

import { useState } from "react";
import { Bell, User, Settings, CheckCircle2 } from "lucide-react";

type SessionType = "Dr. Jack (Clinic Lead)" | "Denis Thuo (Admin)";

export function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [activeSession, setActiveSession] = useState<SessionType>("Dr. Jack (Clinic Lead)");

  // Close other popovers when one is opened
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSettingsOpen(false);
    setIsProfileOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
    setIsSettingsOpen(false);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-6 relative">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="text-slate-400 hover:text-primary transition-colors relative"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-20">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                <div className="p-2 border-b border-slate-100 text-sm hover:bg-slate-50 cursor-pointer rounded">
                  <p className="font-medium text-slate-800">Low Stock Alert</p>
                  <p className="text-xs text-slate-500">Pharmacy is low on Paracetamol.</p>
                </div>
                <div className="p-2 text-sm hover:bg-slate-50 cursor-pointer rounded">
                  <p className="font-medium text-slate-800">New Locum Shift</p>
                  <p className="text-xs text-slate-500">Dr. Smith registered a 12h shift.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile and Settings Container */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 relative">
          
          {/* Profile */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={toggleProfile}
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {activeSession.split(' (')[0]}
              </p>
              <p className="text-xs text-secondary">
                {activeSession.split('(')[1]?.replace(')', '')}
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-primary border border-slate-200 group-hover:bg-blue-50 transition-colors">
              <User className="w-5 h-5" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute top-full right-10 mt-4 w-56 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-20">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">Switch Session</h3>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { setActiveSession("Dr. Jack (Clinic Lead)"); setIsProfileOpen(false); }}
                  className="w-full flex items-center justify-between text-left p-2 text-sm hover:bg-slate-50 rounded"
                >
                  <span className={activeSession === "Dr. Jack (Clinic Lead)" ? "font-semibold text-primary" : "text-slate-700"}>
                    Dr. Jack (Clinic Lead)
                  </span>
                  {activeSession === "Dr. Jack (Clinic Lead)" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
                <button 
                  onClick={() => { setActiveSession("Denis Thuo (Admin)"); setIsProfileOpen(false); }}
                  className="w-full flex items-center justify-between text-left p-2 text-sm hover:bg-slate-50 rounded"
                >
                  <span className={activeSession === "Denis Thuo (Admin)" ? "font-semibold text-primary" : "text-slate-700"}>
                    Denis Thuo (Admin)
                  </span>
                  {activeSession === "Denis Thuo (Admin)" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
            </div>
          )}
          
          {/* Settings */}
          <button 
            onClick={toggleSettings}
            className="text-slate-400 hover:text-primary transition-colors ml-2"
          >
            <Settings className="w-5 h-5" />
          </button>

          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-20">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">Preferences</h3>
              </div>
              <div className="p-2">
                <button className="w-full text-left p-2 text-sm text-slate-700 hover:bg-slate-50 rounded">Account Settings</button>
                <button className="w-full text-left p-2 text-sm text-slate-700 hover:bg-slate-50 rounded">System Preferences</button>
                <button className="w-full text-left p-2 text-sm text-danger hover:bg-red-50 rounded mt-1">Log Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
