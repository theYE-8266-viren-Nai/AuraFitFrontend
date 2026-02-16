import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { workoutPlansApi } from '../../services/workoutPlansApi';
import { WorkoutPlan } from '../../types';

export const TrainerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your clients and workout plans</p>
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
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clients</h3>
          <p className="text-3xl font-bold text-gray-900">
            {new Set(workoutPlans.map((p) => p.member_id)).size}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Plans</h3>
          <p className="text-3xl font-bold text-gray-900">{workoutPlans.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Specialization</h3>
          <p className="text-lg font-bold text-gray-900">
            {user?.trainer?.specialization || 'N/A'}
          </p>
        </div>
      </div>

      {/* Workout Plans */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Workout Plans</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create New Plan
          </button>
        </div>

        {workoutPlans.length > 0 ? (
          <div className="space-y-4">
            {workoutPlans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.member?.name || 'Unknown Member'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Email: {plan.member?.user?.email || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plan Details:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No workout plans created yet</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Your First Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
