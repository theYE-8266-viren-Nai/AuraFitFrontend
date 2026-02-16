import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { membersApi } from '../../services/membersApi';
import { attendanceApi } from '../../services/attendanceApi';
import { paymentsApi } from '../../services/paymentsApi';
import { Member, Attendance, Payment } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, attendanceData, paymentsData] = await Promise.all([
        membersApi.getAll(),
        attendanceApi.getAll(),
        paymentsApi.getAll(),
      ]);

      setMembers(membersData);
      setAttendance(attendanceData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const todayAttendance = attendance.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  const thisMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your gym operations</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Members</h3>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Attendance</h3>
          <p className="text-3xl font-bold text-gray-900">{todayAttendance.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">This Month Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${thisMonthRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Payments</h3>
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Members</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.slice(0, 5).map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.user?.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Payments</h2>
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.member?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">${payment.amount} - {payment.method}</p>
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
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Attendance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Check In
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todayAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {record.member?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.check_in}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.check_out || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
