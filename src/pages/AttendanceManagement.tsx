import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, UserCheck, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { attendanceApi, CreateAttendanceData, UpdateAttendanceFormData } from '../services/attendanceApi';
import { membersApi } from '../services/membersApi';
import { Attendance, Member } from '../types';
import { Modal } from '../components/shared/Modal';
import { useToast } from '../components/shared/Toast';

export const AttendanceManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const { data: attendance, isLoading, error, refetch } = useApi<Attendance[]>(
    () => attendanceApi.getAll()
  );

  const { data: members } = useApi<Member[]>(() => membersApi.getAll());

  const { mutate: createAttendance, isLoading: isCreating } = useMutation(attendanceApi.create);
  const { mutate: updateAttendance, isLoading: isUpdating } = useMutation(attendanceApi.update);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all');

  const [createFormData, setCreateFormData] = useState<CreateAttendanceData>({
    member_id: 0,
    status: 'present',
  });

  const [editFormData, setEditFormData] = useState<UpdateAttendanceFormData>({
    check_out: '',
    status: 'present',
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttendance(createFormData);
      showSuccess('Attendance recorded successfully! 🎊');
      setShowCreateModal(false);
      setCreateFormData({
        member_id: 0,
        status: 'present',
      });
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to record attendance');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttendance) return;

    try {
      await updateAttendance({
        id: selectedAttendance.id,
        ...editFormData
      });
      showSuccess('Attendance updated successfully! ✅');
      setShowEditModal(false);
      setSelectedAttendance(null);
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update attendance');
    }
  };

  const openEditModal = (record: Attendance) => {
    setSelectedAttendance(record);
    setEditFormData({
      check_out: record.check_out || '',
      status: record.status,
    });
    setShowEditModal(true);
  };

  const getFilteredAttendance = () => {
    if (!attendance) return [];

    const now = new Date();
    const today = now.toDateString();
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateFilter) {
      case 'today':
        return attendance.filter(a => new Date(a.date).toDateString() === today);
      case 'week':
        return attendance.filter(a => new Date(a.date) >= thisWeekStart);
      case 'month':
        return attendance.filter(a => new Date(a.date) >= thisMonthStart);
      default:
        return attendance;
    }
  };

  const filteredAttendance = getFilteredAttendance();

  const todayCount = attendance?.filter(a =>
    new Date(a.date).toDateString() === new Date().toDateString()
  ).length || 0;

  const thisMonthCount = attendance?.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length || 0;

  if (isLoading) {
    return (
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
          <p className="text-gray-600 font-medium">Loading attendance...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <motion.div
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-red-800 font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  const filters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Attendance Management
          </h1>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserCheck className="w-5 h-5" />
          Mark Attendance
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Today's Attendance", value: todayCount, color: 'from-red-500 to-orange-500', icon: CheckCircle },
          { label: 'This Month', value: thisMonthCount, color: 'from-orange-500 to-yellow-500', icon: Calendar },
          { label: 'Total Records', value: attendance?.length || 0, color: 'from-yellow-500 to-amber-500', icon: UserCheck },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border-2 border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => setDateFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateFilter === filter.value
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Attendance List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record, index) => (
              <motion.div
                key={record.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {record.member?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{record.member?.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-600">{record.member?.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Check In</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        <p className="font-semibold text-gray-900">{record.check_in}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Check Out</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-red-600" />
                        <p className="font-semibold text-gray-900">{record.check_out || '-'}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full">
                      {record.status}
                    </span>

                    <motion.button
                      onClick={() => openEditModal(record)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No attendance records found</p>
              <p className="text-sm text-gray-400 mt-2">for the selected filter</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Attendance Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Mark Attendance"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member
            </label>
            <select
              required
              value={createFormData.member_id}
              onChange={(e) => setCreateFormData({ ...createFormData, member_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            >
              <option value={0}>Select a member...</option>
              {members?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.user?.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date (Optional - defaults to today)
            </label>
            <input
              type="date"
              value={createFormData.date || ''}
              onChange={(e) => setCreateFormData({ ...createFormData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check In Time (Optional - defaults to now)
            </label>
            <input
              type="time"
              value={createFormData.check_in || ''}
              onChange={(e) => setCreateFormData({ ...createFormData, check_in: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={createFormData.status}
              onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isCreating}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl disabled:opacity-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCreating ? 'Recording...' : 'Mark Attendance'}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Attendance"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {selectedAttendance && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-800 font-semibold">
                Member: {selectedAttendance.member?.name}
              </p>
              <p className="text-sm text-red-800">
                Date: {new Date(selectedAttendance.date).toLocaleDateString()}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check Out Time
            </label>
            <input
              type="time"
              value={editFormData.check_out}
              onChange={(e) => setEditFormData({ ...editFormData, check_out: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl disabled:opacity-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUpdating ? 'Updating...' : 'Update Attendance'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};