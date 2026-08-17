import { 
  LayoutDashboard, Users, ClipboardCheck, 
  CreditCard, FileText, GraduationCap, 
  UserCog, BarChart3, Settings, LogOut, X,
  Wallet, Database
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from  '../../context/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allMenuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Teacher'] },
    { name: 'Students', path: '/students', icon: Users, roles: ['Admin', 'Teacher'] },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck, roles: ['Admin', 'Teacher'] },
    { name: 'Fees', path: '/fees', icon: CreditCard, roles: ['Admin'] },
    { name: 'Exams', path: '/exams', icon: FileText, roles: ['Admin', 'Teacher'] },
    { name: 'Staff', path: '/staff', icon: UserCog, roles: ['Admin'] },
    { name: 'Accounting', path: '/accounting', icon: Wallet, roles: ['Admin'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin'] },
    { name: 'Backup', path: '/backup', icon: Database, roles: ['Admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const menuItems = allMenuItems.filter(item =>
    item.roles.includes(user?.role || 'Admin')
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        {/* Logo + Close button */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">EduManage</h1>
              <p className="text-xs text-slate-500">
                {user?.role || 'School System'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}