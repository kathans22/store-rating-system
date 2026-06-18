import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import SortableTable from '../components/SortableTable';

export default function OwnerDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await api.get('/owner/dashboard', {
        params: { sortBy, sortOrder },
      });
      setDashboard(data);
      setError('');
    } catch {
      setError('Failed to load owner dashboard');
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Rating Given', sortable: true },
  ];

  return (
    <Layout title="Store Owner Dashboard">
      {error && <p className="error-msg">{error}</p>}
      {dashboard && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Store</span>
              <strong>{dashboard.store?.name || 'No store assigned'}</strong>
            </div>
            <div className="stat-card">
              <span>Average Rating</span>
              <strong>
                {dashboard.averageRating !== null
                  ? dashboard.averageRating.toFixed(2)
                  : 'No ratings yet'}
              </strong>
            </div>
            <div className="stat-card">
              <span>Total Raters</span>
              <strong>{dashboard.raters.length}</strong>
            </div>
          </div>

          <h2 className="section-title">Users Who Rated Your Store</h2>
          <SortableTable
            columns={columns}
            rows={dashboard.raters}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(key, order) => {
              setSortBy(key);
              setSortOrder(order);
            }}
            emptyMessage="No ratings submitted yet"
          />
        </>
      )}
    </Layout>
  );
}
