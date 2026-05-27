import React, { useState } from 'react';
import { Shield } from 'lucide-react';

export const PermissionsAndActivity: React.FC = () => {
  const [permissions, setPermissions] = useState({
    apiAccess: true,
    exportLimits: false,
    newProject: true,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Global Permissions SWITCHBOARD */}
      <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-violet-400" size={16} />
          <h3 className="text-xs font-bold text-white tracking-wide">
            Global Permissions
          </h3>
        </div>

        <div className="flex flex-col gap-5">
          {/* Switch 1 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-[11px] font-bold text-slate-200">API Access</span>
              <span className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                Enable for all Pro users.
              </span>
            </div>
            <button 
              onClick={() => togglePermission('apiAccess')}
              className={`w-9 h-5 rounded-full p-[2px] transition-colors duration-300 ${
                permissions.apiAccess ? 'bg-[#7C3AED]' : 'bg-slate-800'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
                permissions.apiAccess ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 2 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-[11px] font-bold text-slate-200">Export Limits</span>
              <span className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                Enforce 4K download caps.
              </span>
            </div>
            <button 
              onClick={() => togglePermission('exportLimits')}
              className={`w-9 h-5 rounded-full p-[2px] transition-colors duration-300 ${
                permissions.exportLimits ? 'bg-[#7C3AED]' : 'bg-slate-800'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
                permissions.exportLimits ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 3 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <span className="text-[11px] font-bold text-slate-200">New Project Creation</span>
              <span className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                Allow auto-approval.
              </span>
            </div>
            <button 
              onClick={() => togglePermission('newProject')}
              className={`w-9 h-5 rounded-full p-[2px] transition-colors duration-300 ${
                permissions.newProject ? 'bg-[#7C3AED]' : 'bg-slate-800'
              }`}
            >
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
                permissions.newProject ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity FEED TIMELINE */}
      <div className="bg-[#131C2E] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-white tracking-wide">
            Recent Activity
          </h3>
          <button className="text-[9px] font-bold text-violet-400 hover:text-violet-300 tracking-wider uppercase flex items-center gap-1">
            See All
          </button>
        </div>

        {/* Timeline lists */}
        <div className="flex flex-col gap-5 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
          
          {/* Feed Item 1 */}
          <div className="flex gap-3 pl-4 relative">
            <span className="absolute left-[1px] top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 ring-4 ring-[#131C2E]" />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                <span className="font-bold text-white">Admin</span> granted <span className="font-bold text-violet-400">Pro access</span> to Sarah
              </p>
              <span className="text-[9px] text-slate-500 font-semibold">2 phút trước</span>
            </div>
          </div>

          {/* Feed Item 2 */}
          <div className="flex gap-3 pl-4 relative">
            <span className="absolute left-[1px] top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 ring-4 ring-[#131C2E]" />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                New user registered via <span className="font-bold text-white">Google</span>
              </p>
              <span className="text-[9px] text-slate-500 font-semibold">15 phút trước</span>
            </div>
          </div>

          {/* Feed Item 3 */}
          <div className="flex gap-3 pl-4 relative">
            <span className="absolute left-[1px] top-1.5 h-1.5 w-1.5 rounded-full bg-pink-400 ring-4 ring-[#131C2E]" />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                System update completed: <span className="font-semibold text-slate-100">v4.2.0</span>
              </p>
              <span className="text-[9px] text-slate-500 font-semibold">1 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
