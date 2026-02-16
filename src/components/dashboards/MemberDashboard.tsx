import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { membershipsApi } from '../../services/membershipsApi';
import { attendanceApi } from '../../services/attendanceApi';
import { workoutPlansApi } from '../../services/workoutPlansApi';
import { paymentsApi } from '../../services/paymentsApi';
import { Attendance, WorkoutPlan, Payment, MembershipStatusResponse } from '../../types';

export const MemberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatusResponse | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

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

  const handleMarkAttendance = async () => {
    setIsMarkingAttendance(true);
    try {
      await attendanceApi.markAttendance();
      await loadData(); // Reload data to get updated attendance
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todayAttendance = attendance.find(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.member?.name || user?.username}!</h1>
          <p className="text-gray-600 mt-1">Member Dashboard</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Membership Status */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Membership Status</h3>
          <p className="text-2xl font-bold text-gray-900">
            {membershipStatus?.has_active_membership ? 'Active' : 'Inactive'}
          </p>
          {membershipStatus?.active_membership && (
            <p className="text-sm text-gray-600 mt-2">
              Expires: {new Date(membershipStatus.active_membership.end_date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Attendance This Month */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Attendance</h3>
          <p className="text-2xl font-bold text-gray-900">
            {attendance.filter((a) => new Date(a.date).getMonth() === new Date().getMonth()).length} days
          </p>
        </div>

        {/* Active Workout Plans */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Workout Plans</h3>
          <p className="text-2xl font-bold text-gray-900">{workoutPlans.length}</p>
        </div>
      </div>

      {/* Mark Attendance */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Attendance</h2>
        {todayAttendance ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">
                  Checked In: {todayAttendance.check_in}
                </p>
                {todayAttendance.check_out && (
                  <p className="text-green-800">Checked Out: {todayAttendance.check_out}</p>
                )}
              </div>
              {!todayAttendance.check_out && (
                <button
                  onClick={handleMarkAttendance}
                  disabled={isMarkingAttendance}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isMarkingAttendance ? 'Processing...' : 'Check Out'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={handleMarkAttendance}
            disabled={isMarkingAttendance}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isMarkingAttendance ? 'Processing...' : 'Check In Now'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Plans */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Workout Plans</h2>
          {workoutPlans.length > 0 ? (
            <div className="space-y-4">
              {workoutPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        Trainer: {plan.trainer?.user?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No workout plans assigned yet</p>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Payments</h2>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">${payment.amount}</p>
                      <p className="text-sm text-gray-600">{payment.method}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No payment history</p>
          )}
        </div>
      </div>
    </div>
  );
};
