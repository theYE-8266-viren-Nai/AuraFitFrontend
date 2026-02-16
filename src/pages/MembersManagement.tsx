import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Mail, Phone, Calendar, Trash2, Search, Filter } from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { membersApi, CreateMemberData } from '../services/membersApi';
import { Member } from '../types';
import { useToast } from '../components/shared/Toast';

export const MembersManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const { data: members, isLoading, error, refetch } = useApi<Member[]>(
    () => membersApi.getAll()
  );
  
  const { mutate: createMember, isLoading: isCreating } = useMutation(membersApi.create);
  const { mutate: deleteMember } = useMutation(membersApi.delete);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateMemberData>({
    username: '',
    email: '',
    password: '',
    name: '',
    age: 0,
    gender: 'male',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMember(formData);
      showSuccess('Member created successfully! 🎊');
      setShowCreateForm(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        age: 0,
        gender: 'male',
        phone: '',
      });
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create member');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMember(id);
        showSuccess('Member deleted successfully');
        refetch();
      } catch (error: any) {
        showError(error.response?.data?.message || 'Failed to delete member');
      }
    }
  };

  const filteredMembers = members?.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

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
          <p className="text-gray-600 font-medium">Loading members...</p>
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
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Members Management
          </h1>
        </div>
        <motion.button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus className="w-5 h-5" />
          {showCreateForm ? 'Cancel' : 'Add Member'}
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Members', value: members?.length || 0, color: 'from-red-500 to-orange-500', icon: Users },
          { label: 'Male Members', value: members?.filter(m => m.gender === 'male').length || 0, color: 'from-orange-500 to-yellow-500', icon: Users },
          { label: 'Female Members', value: members?.filter(m => m.gender === 'female').length || 0, color: 'from-yellow-500 to-amber-500', icon: Users },
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

      {/* Create Member Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border-2 border-white/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-red-600" />
              Create New Member
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Username', name: 'username', type: 'text', icon: Users },
                  { label: 'Email', name: 'email', type: 'email', icon: Mail },
                  { label: 'Password', name: 'password', type: 'password', icon: null },
                  { label: 'Full Name', name: 'name', type: 'text', icon: Users },
                  { label: 'Age', name: 'age', type: 'number', icon: Calendar },
                  { label: 'Phone', name: 'phone', type: 'tel', icon: Phone },
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      {field.icon && (
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                      <input
                        type={field.type}
                        required
                        value={formData[field.name as keyof CreateMemberData] as string | number}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          [field.name]: field.type === 'number' ? parseInt(e.target.value) : e.target.value 
                        })}
                        className={`w-full ${field.icon ? 'pl-11' : ''} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none`}
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>
              </div>

              <motion.button
                type="submit"
                disabled={isCreating}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-xl disabled:opacity-50 transition-all font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCreating ? 'Creating...' : 'Create Member 🎊'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border-2 border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
          />
        </div>
      </motion.div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers && filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <motion.button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {member.user?.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {member.age} years old
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full">
                    {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No members found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};