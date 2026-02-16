import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Dumbbell, 
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  ListChecks
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { workoutPlansApi } from '../services/workoutPlansApi';
import { WorkoutPlan } from '../types';
import { Navbar } from '../components/shared/Navbar';

export const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const plansData = await workoutPlansApi.getAll();
      setWorkoutPlans(plansData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-[#fffcf0]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-red-600 border-t-amber-400 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-red-800 font-bold uppercase tracking-widest">Loading dashboard...</p>
          </motion.div>
        </div>
      </>
    );
  }

  const totalClients = new Set(workoutPlans.map(p => p.member_id)).size;
  const recentPlans = workoutPlans.slice(0, 3);

  const stats = [
    {
      title: 'Total Clients',
      value: totalClients,
      icon: Users,
      bgColor: 'bg-white',
      iconBg: 'bg-red-50',
      textColor: 'text-red-800'
    },
    {
      title: 'Active Plans',
      value: workoutPlans.length,
      icon: ListChecks,
      bgColor: 'bg-white',
      iconBg: 'bg-red-50',
      textColor: 'text-red-800'
    },
    {
      title: 'Specialization',
      value: user?.trainer?.specialization || 'General',
      icon: Award,
      bgColor: 'bg-gradient-to-br from-red-700 to-red-900',
      iconBg: 'bg-white/10',
      textColor: 'text-amber-300',
      isText: true
    },
  ];

  const quickActions = [
    {
      title: 'Workout Plans',
      description: 'Create and manage workout plans for your clients',
      icon: Dumbbell,
      color: 'from-red-600 to-red-800',
      route: '/workout-plans',
      action: 'Manage Plans',
      emoji: '💪'
    },
    {
      title: 'Create New Plan',
      description: 'Design a custom workout plan for a member',
      icon: Plus,
      color: 'from-amber-500 to-red-600',
      route: '/workout-plans',
      action: 'Create Now',
      emoji: '✨'
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffcf0] relative overflow-hidden">
      {/* Dragon Background Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] flex items-center justify-center z-0">
        <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-red-800">
           <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" />
           <circle cx="50" cy="50" r="10" />
           {/* Simple dragon-like motif path */}
           <path d="M30 40 q 20 -20 40 0 t 0 20 t -40 0 t 0 -20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <motion.h1 className="text-4xl font-black text-red-800 uppercase italic">
              Welcome back, Coach {user?.username}!
            </motion.h1>
            <motion.span className="text-4xl" animate={{ rotate: [0, 14, -8, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              🏮
            </motion.span>
          </div>
          <motion.p className="text-red-700/60 font-bold uppercase tracking-widest text-sm">
            Ready to help your clients reach their fitness goals? 🎯
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-2xl shadow-xl p-6 border-2 border-amber-100 hover:border-red-600 transition-all`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor === 'text-amber-300' ? 'text-amber-300' : 'text-red-600'}`} />
                </div>
              </div>
              <p className={`text-xs font-black uppercase tracking-widest mb-1 opacity-60 ${stat.textColor}`}>
                {stat.title}
              </p>
              <p className={`text-3xl font-black ${stat.textColor} ${stat.isText ? 'text-xl' : ''}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={() => navigate(action.route)}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden text-left border-2 border-amber-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{action.emoji}</div>
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${action.color} text-amber-100 text-xs font-black uppercase shadow-md`}>
                    {action.action}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-red-800 uppercase mb-2">{action.title}</h3>
                <p className="text-red-900/40 font-bold">{action.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-amber-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-red-800 uppercase flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-red-600" /> Recent Workout Plans
            </h2>
            <button onClick={() => navigate('/workout-plans')} className="text-red-600 font-black text-xs uppercase flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentPlans.map((plan) => (
              <div key={plan.id} className="p-4 bg-[#fffcf0] border border-red-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-amber-200 font-black">
                    {plan.member?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-red-800 uppercase text-sm">{plan.member?.name}</h4>
                    <p className="text-[10px] font-bold text-red-800/40">{new Date(plan.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-300" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};