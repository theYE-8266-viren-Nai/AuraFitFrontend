import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Edit, Trash2, Users, Award, Target, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi, useMutation } from '../hooks/useApi';
import { workoutPlansApi, CreateWorkoutPlanData, UpdateWorkoutPlanFormData } from '../services/workoutPlansApi';
import { membersApi } from '../services/membersApi';
import { WorkoutPlan, Member } from '../types';
import { Modal } from '../components/shared/Modal';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { useToast } from '../components/shared/Toast';

export const WorkoutPlansManagement: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data: workoutPlans, isLoading, error, refetch } = useApi<WorkoutPlan[]>(
    () => workoutPlansApi.getAll()
  );

  const { data: members } = useApi<Member[]>(() => membersApi.getAll());

  const { mutate: createPlan, isLoading: isCreating } = useMutation(workoutPlansApi.create);
  const { mutate: updatePlan, isLoading: isUpdating } = useMutation(workoutPlansApi.update);
  const { mutate: deletePlan, isLoading: isDeleting } = useMutation(workoutPlansApi.delete);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [createFormData, setCreateFormData] = useState<CreateWorkoutPlanData>({
    member_id: 0,
    description: '',
  });

 const [editFormData, setEditFormData] = useState<UpdateWorkoutPlanFormData>({
  description: '',
});

  const workoutTemplates = [
    {
      name: 'Beginner Full Body',
      icon: '🌱',
      description: `Week 1-4: Foundation Building

Monday - Full Body:
• Bodyweight Squats: 3 sets x 12 reps
• Push-ups (modified if needed): 3 sets x 8-10 reps
• Dumbbell Rows: 3 sets x 10 reps
• Plank: 3 sets x 30 seconds
• Walking: 20 minutes

Wednesday - Cardio & Core:
• Brisk Walking/Light Jogging: 25 minutes
• Bicycle Crunches: 3 sets x 15 reps
• Mountain Climbers: 3 sets x 10 reps
• Side Plank: 3 sets x 20 seconds each side

Friday - Full Body:
• Goblet Squats: 3 sets x 10 reps
• Dumbbell Chest Press: 3 sets x 10 reps
• Lat Pulldowns: 3 sets x 10 reps
• Russian Twists: 3 sets x 20 reps
• Stretching: 10 minutes`,
    },
    {
      name: 'Weight Loss Program',
      icon: '🔥',
      description: `12-Week Fat Loss Plan

Monday - HIIT + Strength:
• Jump Rope: 3 minutes
• Burpees: 3 sets x 10 reps
• Kettlebell Swings: 3 sets x 15 reps
• Mountain Climbers: 3 sets x 30 seconds
• Plank: 3 sets x 45 seconds

Tuesday - Cardio:
• Treadmill Intervals: 30 minutes
  (2 min jog, 1 min sprint)
• Rowing Machine: 10 minutes

Thursday - Circuit Training:
• Jump Squats: 3 sets x 12 reps
• Push-ups: 3 sets x 15 reps
• Dumbbell Lunges: 3 sets x 12 reps each leg
• Battle Ropes: 3 sets x 30 seconds
• Box Jumps: 3 sets x 10 reps

Saturday - Active Recovery:
• Light Swimming: 30 minutes
• Yoga/Stretching: 20 minutes`,
    },
    {
      name: 'Muscle Building',
      icon: '💪',
      description: `Advanced Hypertrophy Program

Monday - Chest & Triceps:
• Bench Press: 4 sets x 8-10 reps
• Incline Dumbbell Press: 4 sets x 10-12 reps
• Cable Flyes: 3 sets x 12-15 reps
• Tricep Dips: 4 sets x 10-12 reps
• Overhead Tricep Extension: 3 sets x 12 reps

Wednesday - Back & Biceps:
• Deadlifts: 4 sets x 6-8 reps
• Pull-ups: 4 sets x 8-10 reps
• Barbell Rows: 4 sets x 10 reps
• Hammer Curls: 3 sets x 12 reps
• Cable Bicep Curls: 3 sets x 12 reps

Friday - Legs & Shoulders:
• Squats: 4 sets x 8-10 reps
• Leg Press: 4 sets x 12 reps
• Military Press: 4 sets x 8-10 reps
• Lateral Raises: 3 sets x 12 reps
• Leg Curls: 3 sets x 12 reps`,
    },
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlan(createFormData);
      showSuccess('Workout plan created successfully! 🎊');
      setShowCreateModal(false);
      setCreateFormData({
        member_id: 0,
        description: '',
      });
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create workout plan');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      await updatePlan({
        id: selectedPlan.id,
        description: editFormData.description
      });
      showSuccess('Workout plan updated successfully! ✅');
      setShowEditModal(false);
      setSelectedPlan(null);
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update workout plan');
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await deletePlan(selectedPlan.id);
      showSuccess('Workout plan deleted successfully');
      setShowDeleteModal(false);
      setSelectedPlan(null);
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to delete workout plan');
    }
  };

  const openEditModal = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setEditFormData({
      description: plan.description,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const useTemplate = (template: typeof workoutTemplates[0]) => {
    setCreateFormData({
      ...createFormData,
      description: template.description,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffcf0]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-red-800 font-bold uppercase tracking-widest">Loading workout plans...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffcf0]">
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

  const totalClients = new Set(workoutPlans?.map(p => p.member_id)).size;

  return (
    <div className="min-h-screen bg-[#fffcf0] relative overflow-hidden">
      {/* Fixed Dragon Background Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center z-0">
        <span className="text-[500px] select-none">🐉</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8 border-b-2 border-red-200 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-xl shadow-lg border-2 border-amber-400">
              <Dumbbell className="w-6 h-6 text-amber-100" />
            </div>
            <h1 className="text-3xl font-black text-red-800 uppercase italic tracking-tight">
              Workout Plans Management
            </h1>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-red-600 text-amber-100 rounded-xl hover:shadow-2xl transition-all font-black uppercase tracking-widest border-b-4 border-red-800 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Create Workout Plan
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Plans', value: workoutPlans?.length || 0, color: 'bg-red-600', icon: Dumbbell },
            { label: 'Active Clients', value: totalClients, color: 'bg-red-700', icon: Users },
            { label: 'Your Specialty', value: user?.trainer?.specialization || 'General', color: 'bg-red-800', icon: Award, isText: true },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-100 hover:border-red-600 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-red-800/60 mb-1">{stat.label}</p>
              <p className={`font-black text-red-800 ${stat.isText ? 'text-xl' : 'text-3xl'}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Workout Plans List */}
        <div className="space-y-4">
          <AnimatePresence>
            {workoutPlans && workoutPlans.length > 0 ? (
              workoutPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-50 hover:border-red-600 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center text-amber-200 font-black text-xl shadow-lg border-2 border-amber-400">
                        {plan.member?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-red-800 uppercase">
                            {plan.member?.name || 'Unknown Member'}
                          </h3>
                          <span className="px-3 py-1 text-[10px] font-black bg-red-100 text-red-700 rounded-full uppercase tracking-widest">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-red-900/40 uppercase tracking-tight">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {plan.member?.user?.email || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {plan.member?.phone || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 italic">
                            📅 {new Date(plan.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => openEditModal(plan)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => openDeleteModal(plan)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="bg-[#fffcf0] rounded-xl p-4 border-l-4 border-red-600">
                    <h4 className="text-xs font-black text-red-800 uppercase mb-3 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-red-600" />
                      Workout Plan Details
                    </h4>
                    <pre className="text-sm text-red-900 font-medium whitespace-pre-wrap font-sans leading-relaxed">
                      {plan.description}
                    </pre>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-amber-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Dumbbell className="w-20 h-20 text-red-100 mx-auto mb-4" />
                <h3 className="text-xl font-black text-red-800 uppercase mb-2">No Workout Plans Yet</h3>
                <p className="text-red-900/40 font-bold mb-6 uppercase text-xs tracking-widest">Create your first workout plan to get started!</p>
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-red-600 text-amber-100 rounded-xl hover:shadow-lg transition-all font-black uppercase"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create First Plan
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Create Workout Plan Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="🧧 Create Workout Plan"
          size="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-red-800 uppercase mb-2">
                Select Member
              </label>
              <select
                required
                value={createFormData.member_id}
                onChange={(e) => setCreateFormData({ ...createFormData, member_id: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:border-red-600 bg-red-50/50 outline-none font-bold text-red-800"
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
              <label className="block text-xs font-black text-red-800 uppercase mb-3">
                Workout Templates (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {workoutTemplates.map((template) => (
                  <motion.button
                    key={template.name}
                    type="button"
                    onClick={() => useTemplate(template)}
                    className="p-4 border-2 border-amber-100 rounded-xl text-left hover:border-red-600 hover:bg-red-50 transition-all bg-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{template.icon}</span>
                      <span className="font-black text-red-800 text-[10px] uppercase tracking-tighter">{template.name}</span>
                    </div>
                    <div className="text-[10px] font-bold text-red-800/40 uppercase">Click to use</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-red-800 uppercase mb-2">
                Workout Plan Description
              </label>
              <textarea
                required
                rows={12}
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:border-red-600 bg-red-50/50 outline-none font-medium text-red-900 font-sans"
                placeholder="Enter detailed workout plan here..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border-2 border-amber-200 rounded-xl text-red-800 font-black uppercase text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isCreating}
                className="px-6 py-3 bg-red-600 text-amber-100 rounded-xl disabled:opacity-50 font-black uppercase text-xs border-b-4 border-red-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCreating ? 'Creating...' : 'Create Plan 🧨'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Edit Workout Plan Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="🖋️ Edit Workout Plan"
          size="xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {selectedPlan && (
              <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-black text-red-800 uppercase">
                  Member: {selectedPlan.member?.name}
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-red-800 uppercase mb-2">
                Workout Plan Description
              </label>
              <textarea
                required
                rows={12}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:border-red-600 bg-red-50/50 outline-none font-medium text-red-900 font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 border-2 border-amber-200 rounded-xl text-red-800 font-black uppercase text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-red-600 text-amber-100 rounded-xl disabled:opacity-50 font-black uppercase text-xs border-b-4 border-red-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUpdating ? 'Updating...' : 'Update Plan ✅'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Workout Plan"
          message={`Are you sure you want to delete the workout plan for ${selectedPlan?.member?.name}? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
          variant="danger"
        />
      </div>
    </div>
  );
};