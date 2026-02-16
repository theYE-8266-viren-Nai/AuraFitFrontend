import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle, 
  Calendar,
  Dumbbell,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { membershipsApi } from '../services/membershipsApi';
import { attendanceApi } from '../services/attendanceApi';
import { workoutPlansApi } from '../services/workoutPlansApi';
import { paymentsApi } from '../services/paymentsApi';
import { Attendance, WorkoutPlan, Payment, MembershipStatusResponse } from '../types/index';
import { Navbar } from '../components/shared/Navbar';
import { useToast } from '../components/shared/Toast';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatusResponse | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusData, attendanceData, plansData, paymentsData] = await Promise.all([
        membershipsApi.getStatus(),
        attendanceApi.myAttendance(),
        workoutPlansApi.myPlans(),
        paymentsApi.myPayments(),
      ]);

      setMembershipStatus(statusData);
      setAttendance(attendanceData);
      setWorkoutPlans(plansData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (todayAttendance) return;
    try {
      await attendanceApi.markAttendance();
      showSuccess('Checked in successfully! 🎯');
      await loadData();
    } catch (error) {
      showError('Failed to mark attendance');
    }
  };

  const monthlyAttendance = attendance.filter((a) => 
    new Date(a.date).getMonth() === new Date().getMonth()
  ).length;

  const todayAttendance = attendance.find(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 font-medium">Loading your fitness profile...</p>
          </motion.div>
        </div>
      </>
    );
  }

  const stats = [
    {
      title: 'Monthly Attendance',
      value: `${monthlyAttendance} days`,
      icon: Calendar,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100'
    },
    {
      title: 'Workout Plans',
      value: workoutPlans.length,
      icon: Dumbbell,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Total Payments',
      value: payments.length,
      icon: CreditCard,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100'
    },
  ];

  const quickActions = [
    {
      title: 'Make Payment',
      description: 'Pay for membership or renew subscription',
      icon: CreditCard,
      color: 'from-red-500 to-orange-500',
      route: '/my-payments',
      action: 'Pay Now',
      emoji: '💳'
    },
    {
      title: 'Check In',
      description: todayAttendance ? 'Already checked in today' : 'Mark your attendance',
      icon: CheckCircle,
      color: todayAttendance ? 'from-gray-400 to-gray-500' : 'from-orange-500 to-yellow-500',
      route: '/dashboard',
      action: todayAttendance ? 'Checked In' : 'Check In',
      disabled: !!todayAttendance,
      emoji: '✅'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back, {user?.member?.name || user?.username}!
            </motion.h1>
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              🔥
            </motion.span>
          </div>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Time to push your limits and crush those goals! 💪
          </motion.p>
        </motion.div>

        {/* Membership Status Banner */}
        <motion.div
          className={`rounded-2xl shadow-2xl p-6 mb-8 border-2 ${
            membershipStatus?.has_active_membership
              ? 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-300'
              : 'bg-gradient-to-r from-gray-700 to-gray-900 border-gray-600'
          } text-white`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {membershipStatus?.has_active_membership ? (
                  <CheckCircle className="w-8 h-8 text-yellow-300" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-400" />
                )}
                <h2 className="text-2xl font-bold">
                  {membershipStatus?.has_active_membership ? 'Membership Active ✅' : 'No Active Membership ⚠️'}
                </h2>
              </div>
              {membershipStatus?.has_active_membership ? (
                <>
                  <p className="text-white/90 mb-1 text-lg">
                    Plan: <span className="font-semibold">{membershipStatus.active_membership?.type}</span>
                  </p>
                  <p className="text-white/90">
                    Expires: <span className="font-semibold">{new Date(membershipStatus.active_membership?.end_date || '').toLocaleDateString()}</span>
                  </p>
                </>
              ) : (
                <p className="text-white/90 mb-4 text-lg">Your membership has expired or hasn't started yet.</p>
              )}
            </div>
            {!membershipStatus?.has_active_membership && (
              <motion.button
                onClick={() => navigate('/my-payments')}
                className="px-6 py-3 bg-white text-red-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Renew Now
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-2xl shadow-lg p-6 border-2 border-white/50 backdrop-blur-sm hover:shadow-xl transition-all`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Daily Essentials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={() => {
                  if (action.title === 'Check In') {
                    handleCheckIn();
                  } else {
                    navigate(action.route);
                  }
                }}
                disabled={action.disabled}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden text-left border-2 border-white/50 ${
                  action.disabled ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={action.disabled ? {} : { scale: 1.05, y: -8 }}
                whileTap={action.disabled ? {} : { scale: 0.98 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 ${!action.disabled && 'group-hover:opacity-10'} transition-opacity`}></div>
                <div className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`text-6xl`}
                      animate={action.disabled ? {} : { scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {action.emoji}
                    </motion.div>
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${action.color} text-white text-sm font-bold shadow-md`}>
                      {action.action}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>
                {!action.disabled && (
                  <motion.div
                    className="absolute bottom-6 right-6 text-gray-300 group-hover:text-red-500 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Workout Plans */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Dumbbell className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Active Workout Plans</h2>
            </div>
            {workoutPlans.length > 0 ? (
              <div className="space-y-4">
                {workoutPlans.slice(0, 2).map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    className="border-2 border-orange-100 rounded-xl p-4 bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600 font-medium">
                        Trainer: {plan.trainer?.user?.username}
                      </span>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
                        {plan.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No workout plans assigned yet</p>
              </div>
            )}
          </motion.div>

          {/* Recent Attendance */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Recent Check-ins</h2>
            </div>
            {attendance.length > 0 ? (
              <div className="space-y-2">
                {attendance.slice(0, 5).map((record, index) => (
                  <motion.div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    whileHover={{ x: -5, scale: 1.02 }}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.check_in} {record.check_out && `- ${record.check_out}`}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-md">
                      {record.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No records yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Motivation Section */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 rounded-2xl shadow-2xl p-8 text-white border-2 border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Warrior Mentality 🔥</h3>
          </div>
          <p className="text-xl italic mb-3">
            "Pain is temporary. Pride is forever. Get up and make it count!"
          </p>
          <p className="text-orange-100">
            You've hit the gym <span className="font-bold text-white">{monthlyAttendance} times</span> this month. Keep building that streak! 🚀
          </p>
        </motion.div>
      </div>
    </div>
  );
};