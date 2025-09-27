// import React, { useState, useEffect } from 'react';
// import { Plus, MapPin, Users, CreditCard, DollarSign, Edit, Trash2 } from 'lucide-react';
// import Card from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Modal from '../components/UI/Modal';
// import { useForm } from 'react-hook-form';
// import { Village } from '../types';
// import { villagesAPI } from '../services/api';

// interface VillageForm {
//   name: string;
//   code: string;
//   description?: string;
// }

// const Villages: React.FC = () => {
//   const [villages, setVillages] = useState<Village[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingVillage, setEditingVillage] = useState<Village | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string>('');

//   const { register, handleSubmit, reset, formState: { errors } } = useForm<VillageForm>();

//   useEffect(() => {
//     fetchVillages();
//   }, []);

//   const fetchVillages = async () => {
//     try {
//       setError('');
//       const data = await villagesAPI.getAll();
//       setVillages(data);
//     } catch (error: any) {
//       console.error('Failed to fetch villages:', error);
//       setError('Failed to load villages. Please check if the backend server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateVillage = () => {
//     setEditingVillage(null);
//     reset();
//     setIsModalOpen(true);
//   };

//   const handleEditVillage = (village: Village) => {
//     setEditingVillage(village);
//     reset({
//       name: village.name,
//       code: village.code,
//       description: village.description
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeleteVillage = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this village?')) return;

//     try {
//       await villagesAPI.delete(id);
//       setVillages(villages.filter(v => v.id !== id));
//     } catch (error: any) {
//       console.error('Failed to delete village:', error);
//       alert('Failed to delete village: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const onSubmit = async (data: VillageForm) => {
//     setIsSubmitting(true);
//     try {
//       if (editingVillage) {
//         const updated = await villagesAPI.update(editingVillage.id, data);
//         setVillages(villages.map(v => v.id === editingVillage.id ? updated : v));
//       } else {
//         const created = await villagesAPI.create(data);
//         setVillages([...villages, created]);
//       }
//       setIsModalOpen(false);
//       reset();
//     } catch (error: any) {
//       console.error('Failed to save village:', error);
//       alert('Failed to save village: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold">Error Loading Villages</p>
//           <p className="text-sm">{error}</p>
//         </div>
//         <Button onClick={fetchVillages}>Retry</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Villages</h1>
//           <p className="text-gray-600">Manage village locations and communities</p>
//         </div>
//         <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateVillage}>
//           Add Village
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {villages.map((village) => (
//           <Card key={village.id} hover className="relative">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//                   <MapPin className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{village.name}</h3>
//                   <p className="text-sm text-gray-500">Code: {village.code}</p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEditVillage(village)}
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                 >
//                   <Edit className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteVillage(village.id)}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {village.description && (
//               <p className="text-sm text-gray-600 mt-3">{village.description}</p>
//             )}

//             <div className="mt-4 grid grid-cols-3 gap-4">
//               <div className="text-center">
//                 <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg mx-auto mb-1">
//                   <Users className="h-4 w-4 text-emerald-600" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">{village.totalCustomers || 0}</p>
//                 <p className="text-xs text-gray-500">Customers</p>
//               </div>
//               <div className="text-center">
//                 <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-1">
//                   <CreditCard className="h-4 w-4 text-orange-600" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">{village.totalLoans || 0}</p>
//                 <p className="text-xs text-gray-500">Loans</p>
//               </div>
//               <div className="text-center">
//                 <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
//                   <DollarSign className="h-4 w-4 text-purple-600" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">₹{(village.totalAmount || 0).toLocaleString()}</p>
//                 <p className="text-xs text-gray-500">Total</p>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {villages.length === 0 && (
//         <div className="text-center py-12">
//           <MapPin className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No villages</h3>
//           <p className="mt-1 text-sm text-gray-500">Get started by creating a new village.</p>
//           <div className="mt-6">
//             <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateVillage}>
//               Add Village
//             </Button>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingVillage ? 'Edit Village' : 'Add New Village'}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Village Name
//             </label>
//             <input
//               {...register('name', { required: 'Village name is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter village name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Village Code
//             </label>
//             <input
//               {...register('code', { required: 'Village code is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter village code"
//             />
//             {errors.code && (
//               <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description (Optional)
//             </label>
//             <textarea
//               {...register('description')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter village description"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={isSubmitting}>
//               {editingVillage ? 'Update' : 'Create'} Village
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Villages;

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Users, CreditCard, DollarSign, Edit, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { useForm } from 'react-hook-form';
import { Village } from '../types';
import { villagesAPI } from '../services/api';

interface VillageForm {
  name: string;
  code: string;
  description?: string;
}

const Villages: React.FC = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VillageForm>();

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      setError('');
      const data = await villagesAPI.getAll();
      setVillages(data);
    } catch (error: any) {
      console.error('Failed to fetch villages:', error);
      setError('Failed to load villages. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVillage = () => {
    setEditingVillage(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditVillage = (village: Village) => {
    setEditingVillage(village);
    reset({
      name: village.name,
      code: village.code,
      description: village.description
    });
    setIsModalOpen(true);
  };

  const handleDeleteVillage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this village?')) return;

    try {
      await villagesAPI.delete(id);
      setVillages(villages.filter(v => v.id !== id));
    } catch (error: any) {
      console.error('Failed to delete village:', error);
      alert('Failed to delete village: ' + (error.response?.data?.message || error.message));
    }
  };

  const onSubmit = async (data: VillageForm) => {
    setIsSubmitting(true);
    try {
      if (editingVillage) {
        const updated = await villagesAPI.update(editingVillage.id, data);
        setVillages(villages.map(v => v.id === editingVillage.id ? updated : v));
      } else {
        const created = await villagesAPI.create(data);
        setVillages([...villages, created]);
      }
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      console.error('Failed to save village:', error);
      alert('Failed to save village: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="text-lg font-semibold">Error Loading Villages</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchVillages}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Villages</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage village locations and communities</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateVillage}>
          Add Village
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villages.map((village) => (
          <Card key={village.id} hover className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{village.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Code: {village.code}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditVillage(village)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteVillage(village.id)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {village.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{village.description}</p>
            )}

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mx-auto mb-1">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{village.totalCustomers || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg mx-auto mb-1">
                  <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{village.totalLoans || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Loans</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-1">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">₹{(village.totalAmount || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {villages.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No villages</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new village.</p>
          <div className="mt-6">
            <Button icon={<Plus className="h-4 w-4" />} onClick={handleCreateVillage}>
              Add Village
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVillage ? 'Edit Village' : 'Add New Village'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Village Name
            </label>
            <input
              {...register('name', { required: 'Village name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter village name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Village Code
            </label>
            <input
              {...register('code', { required: 'Village code is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter village code"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter village description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingVillage ? 'Update' : 'Create'} Village
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Villages;