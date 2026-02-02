import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Applications */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
        </div>

        {/* Applied */}
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <p className="text-sm text-blue-600 mb-1">Applied</p>
          <p className="text-3xl font-bold text-blue-700">{stats?.stats?.Applied || 0}</p>
        </div>

        {/* Interview */}
        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <p className="text-sm text-yellow-600 mb-1">Interview</p>
          <p className="text-3xl font-bold text-yellow-700">{stats?.stats?.Interview || 0}</p>
        </div>

        {/* Offer */}
        <div className="bg-green-50 rounded-lg shadow p-6">
          <p className="text-sm text-green-600 mb-1">Offer</p>
          <p className="text-3xl font-bold text-green-700">{stats?.stats?.Offer || 0}</p>
        </div>
      </div>

      {/* Rejected */}
      <div className="bg-red-50 rounded-lg shadow p-6 mb-8">
        <p className="text-sm text-red-600 mb-1">Rejected</p>
        <p className="text-3xl font-bold text-red-700">{stats?.stats?.Rejected || 0}</p>
      </div>

      {/* Total Resumes */}
      <div className="bg-purple-50 rounded-lg shadow p-6 mb-8">
        <p className="text-sm text-purple-600 mb-1">Total Resumes</p>
        <p className="text-3xl font-bold text-purple-700">{stats?.totalResumes || 0}</p>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
        </div>
        <div className="p-6">
          {stats?.recentApplications?.length === 0 ? (
            <p className="text-gray-500">No applications yet. Start tracking your job applications!</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentApplications?.map((app) => (
                <div key={app._id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.role}</h3>
                      <p className="text-sm text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Resume: {app.resumeId?.originalName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {app.notes && (
                    <p className="text-sm text-gray-600 mt-2">{app.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;