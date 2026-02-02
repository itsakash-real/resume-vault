import { useState, useEffect } from 'react';
import axios from 'axios';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  // Form state
  const [formData, setFormData] = useState({
    resumeId: '',
    company: '',
    role: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');

  // Fetch data on load
  useEffect(() => {
    fetchApplications();
    fetchResumes();
  }, []);

  // Fetch applications when filter changes
  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = statusFilter === 'All' 
        ? `${import.meta.env.VITE_API_URL}/applications`
        : `${import.meta.env.VITE_API_URL}/applications?status=${statusFilter}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/resumes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResumes(res.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.resumeId || !formData.company || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        // Update existing
        await axios.put(
          `${import.meta.env.VITE_API_URL}/applications/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Create new
        await axios.post(
          `${import.meta.env.VITE_API_URL}/applications`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      // Reset form
      resetForm();
      fetchApplications();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  // Handle edit
  const handleEdit = (app) => {
    setEditingId(app._id);
    setFormData({
      resumeId: app.resumeId._id,
      company: app.company,
      role: app.role,
      status: app.status,
      applicationDate: new Date(app.applicationDate).toISOString().split('T')[0],
      notes: app.notes
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      resumeId: '',
      company: '',
      role: '',
      status: 'Applied',
      applicationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Application'}
        </button>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
        <div className="flex gap-2">
          {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Application Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Application' : 'Add New Application'}
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {resumes.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              Please upload a resume first before adding applications.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume Used *
                  </label>
                  <select
                    value={formData.resumeId}
                    onChange={(e) => setFormData({ ...formData, resumeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a resume</option>
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.originalName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Google"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Date
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDate}
                    onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this application..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update Application' : 'Add Application'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No applications found. {statusFilter !== 'All' && `Try changing the filter or `}
            Click "Add Application" to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <div key={app._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{app.role}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-700">{app.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied: {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Resume: {app.resumeId?.originalName}
                    </p>
                    {app.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{app.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(app)}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;