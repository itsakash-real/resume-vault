import { useState, useEffect } from 'react';
import axios from 'axios';

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form state
  const [file, setFile] = useState(null);
  const [originalName, setOriginalName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Fetch resumes on load
  useEffect(() => {
    fetchResumes();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file || !originalName) {
      setError('Please provide both file and name');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('originalName', originalName);
      formData.append('notes', notes);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/resumes/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Reset form
      setFile(null);
      setOriginalName('');
      setNotes('');
      setShowUploadForm(false);
      
      // Refresh list
      fetchResumes();
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/resumes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showUploadForm ? 'Cancel' : 'Upload Resume'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Resume</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume Name *
              </label>
              <input
                type="text"
                value={originalName}
                onChange={(e) => setOriginalName(e.target.value)}
                placeholder="e.g., Software Engineer Resume v2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this resume version..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        </div>
      )}

      {/* Resumes List */}
      <div className="bg-white rounded-lg shadow">
        {resumes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No resumes uploaded yet. Click "Upload Resume" to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resumes.map((resume) => (
              <div key={resume._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{resume.originalName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
                    </p>
                    {resume.notes && (
                      <p className="text-sm text-gray-600 mt-2">{resume.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
  <a
    href={`http://localhost:5000/uploads/${resume.fileName}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
  >
    View
  </a>

  <button
    onClick={() => handleDelete(resume._id)}
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

export default Resumes;