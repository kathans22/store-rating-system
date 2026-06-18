import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load dashboard stats'));
  }, []);

  return (
    <Layout title="Admin Dashboard">
      {error && <p className="error-msg">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Users</span>
          <strong>{stats?.totalUsers ?? '—'}</strong>
        </div>
        <div className="stat-card">
          <span>Total Stores</span>
          <strong>{stats?.totalStores ?? '—'}</strong>
        </div>
        <div className="stat-card">
          <span>Total Ratings</span>
          <strong>{stats?.totalRatings ?? '—'}</strong>
        </div>
      </div>

      <div className="action-grid">
        <Link to="/admin/users" className="action-card">
          Manage Users
        </Link>
        <Link to="/admin/stores" className="action-card">
          Manage Stores
        </Link>
        <Link to="/admin/users/new" className="action-card">
          Add User
        </Link>
        <Link to="/admin/stores/new" className="action-card">
          Add Store
        </Link>
      </div>
    </Layout>
  );
}
