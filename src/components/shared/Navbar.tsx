import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  CreditCard,
  DollarSign,
  ClipboardList,
  Dumbbell,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from './Toast';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully! See you soon! 👋');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClasses = (path: string) => {
    return isActive(path)
      ? 'bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg'
      : 'text-white/90 hover:bg-white/10 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all';
  };

  const adminMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/memberships', label: 'Memberships', icon: CreditCard },
    { path: '/payments', label: 'Payments', icon: DollarSign },
    { path: '/attendance', label: 'Attendance', icon: ClipboardList },
  ];

  const trainerMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/workout-plans', label: 'Workout Plans', icon: Dumbbell },
  ];

  const memberMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/my-payments', label: 'Payments', icon: CreditCard },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenu;
      case 'trainer':
        return trainerMenu;
      case 'member':
        return memberMenu;
      default:
        return [];
    }
  };

  const getRoleBadge = () => {
    const badges = {
      admin: { label: 'Admin', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
      trainer: { label: 'Trainer', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
      member: { label: 'Member', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
    };
    return badges[user?.role as keyof typeof badges] || badges.member;
  };

  const menuItems = getMenuItems();
  const roleBadge = getRoleBadge();

  return (
    <motion.nav
      className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 shadow-2xl relative overflow-hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -left-4 text-4xl opacity-30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🏮
        </motion.div>
        <motion.div
          className="absolute -top-4 right-1/4 text-3xl opacity-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧧
        </motion.div>
        <motion.div
          className="absolute -bottom-2 right-10 text-3xl opacity-30"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/dashboard" className="flex items-center gap-3">
              <motion.div
                className="flex-shrink-0 bg-white/20 backdrop-blur-sm p-2 rounded-xl"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Dumbbell className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <div className="text-white text-lg font-bold flex items-center gap-2">
                  AuraFIT
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-white/80 text-xs">{user?.username}</div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={linkClasses(item.path)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.span
              className={`${roleBadge.color} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              {roleBadge.label}
            </motion.span>
            <motion.button
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none backdrop-blur-sm bg-white/10"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`${isActive(item.path)
                      ? 'bg-red-600 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                      } flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-white/20 pt-3 mt-3 space-y-3">
                <div className="px-4">
                  <motion.span
                    className={`${roleBadge.color} text-white px-4 py-2 rounded-full text-xs font-bold inline-block shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {roleBadge.label}
                  </motion.span>
                  <div className="text-white/80 text-sm mt-2">{user?.username}</div>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="w-full text-left bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};