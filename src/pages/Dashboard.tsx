import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MemberDashboard } from '../pages/MemberDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { TrainerDashboard } from '../pages/TrainerDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
  <>  
    {user.role === 'admin' && <AdminDashboard />}
    {user.role === 'trainer' && <TrainerDashboard />}
    {user.role === 'member' && <MemberDashboard />}
  </>
);
};
