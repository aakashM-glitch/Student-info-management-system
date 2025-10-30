import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const departments = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical'
];

const sections = ['A', 'B', 'C', 'D'];
const years = [1, 2, 3, 4];

export default function StudentForm({ editMode, viewMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    department: '',
    year: '',
    section: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStudent();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const { data } = await axios.get(`/api/students/${id}`);
      setFormData(data.data);
      setInitialData(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch student details');
      navigate('/students');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const modifiedFields = editMode ? getModifiedFields() : formData;

    if (editMode && Object.keys(modifiedFields).length === 0) {
      toast.error('No changes made');
      return false;
    }

    Object.keys(modifiedFields).forEach(field => {
      if (field === 'email' && formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (field === 'phone' && formData.phone && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number (10 digits required)';
      }
      if (field === 'year' && formData.year && (parseInt(formData.year) < 1 || parseInt(formData.year) > 4)) {
        newErrors.year = 'Year must be between 1 and 4';
      }
    });

    // Only validate required fields for new student
    if (!editMode) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.rollNo) newErrors.rollNo = 'Roll Number is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.department || formData.department === '') newErrors.department = 'Department is required';
      if (!formData.year || formData.year === '') newErrors.year = 'Year is required';
      if (!formData.section || formData.section === '') newErrors.section = 'Section is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to get modified fields
  const getModifiedFields = () => {
    const changedFields = {};
    if (!initialData) return changedFields;
    Object.keys(formData).forEach(key => {
      if ((formData[key] || '') !== (initialData[key] || '')) {
        changedFields[key] = formData[key];
      }
    });
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editMode) {
        const modifiedData = getModifiedFields();
        if (Object.keys(modifiedData).length === 0) {
          toast.error('No changes made');
          setIsSubmitting(false);
          return;
        }
        if (modifiedData.year) modifiedData.year = parseInt(modifiedData.year, 10);
        await axios.put(`/api/students/${id}`, modifiedData);
        toast.success('Student updated successfully');
      } else {
        // Convert year to number since it's expected as a Number in the schema
        const studentData = {
          ...formData,
          year: parseInt(formData.year, 10)
        };
        const response = await axios.post('/api/students', studentData);
        console.log('Server response:', response.data);
        toast.success('Student created successfully');
      }
      navigate('/students');
    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = error.response?.data?.message || 
        (error.response?.data?.error ? Object.values(error.response.data.error).join(', ') : 'Something went wrong');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">
        {viewMode ? 'View Student' : editMode ? 'Edit Student' : 'Add New Student'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name {!editMode && '*'}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={viewMode}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } ${viewMode ? 'bg-gray-100' : ''}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Roll Number {!editMode && '*'}
          </label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            disabled={viewMode || editMode}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.rollNo ? 'border-red-500' : 'border-gray-300'
            } ${(viewMode || editMode) ? 'bg-gray-100' : ''}`}
          />
          {errors.rollNo && <p className="mt-1 text-sm text-red-500">{errors.rollNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email {!editMode && '*'}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={viewMode}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } ${viewMode ? 'bg-gray-100' : ''}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={viewMode}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            } ${viewMode ? 'bg-gray-100' : ''}`}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year *</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            disabled={viewMode}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            } ${viewMode ? 'bg-gray-100' : ''}`}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Section *
          </label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              disabled={viewMode}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.section ? 'border-red-500' : 'border-gray-300'
              } ${viewMode ? 'bg-gray-100' : ''}`}
            >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          {errors.section && <p className="mt-1 text-sm text-red-500">{errors.section}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={viewMode}
            placeholder="10 digit mobile number"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } ${viewMode ? 'bg-gray-100' : ''}`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address *
          </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={viewMode}
              rows="3"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } ${viewMode ? 'bg-gray-100' : ''}`}
            ></textarea>
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            {viewMode ? 'Back' : 'Cancel'}
          </button>
          {!viewMode && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editMode ? 'Update' : 'Create'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}