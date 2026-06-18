import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import SortableTable from '../components/SortableTable';

const FILTER_FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Search by store name' },
  { name: 'address', label: 'Address', placeholder: 'Search by address' },
];

function RatingCell({ store, onRated }) {
  const [rating, setRating] = useState(store.userRating || 3);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submitRating = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post(`/stores/${store.id}/ratings`, { rating: Number(rating) });
      setMessage(store.userRating ? 'Rating updated' : 'Rating submitted');
      onRated();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-cell">
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-primary btn-sm" onClick={submitRating} disabled={loading}>
        {store.userRating ? 'Update' : 'Submit'}
      </button>
      {message && <span className="inline-msg">{message}</span>}
    </div>
  );
}

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      const { data } = await api.get('/stores', {
        params: { ...filters, sortBy, sortOrder },
      });
      setStores(data.stores);
      setError('');
    } catch {
      setError('Failed to load stores');
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'overallRating',
      label: 'Overall Rating',
      sortable: true,
      render: (row) => (row.overallRating !== null ? row.overallRating.toFixed(2) : 'N/A'),
    },
    {
      key: 'userRating',
      label: 'Your Rating',
      render: (row) => (row.userRating !== null ? row.userRating : 'Not rated'),
    },
    {
      key: 'actions',
      label: 'Submit / Modify Rating',
      render: (row) => <RatingCell store={row} onRated={fetchStores} />,
    },
  ];

  return (
    <Layout title="Browse Stores">
      <FilterBar
        filters={filters}
        fields={FILTER_FIELDS}
        onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onReset={() => setFilters({ name: '', address: '' })}
      />
      {error && <p className="error-msg">{error}</p>}
      <SortableTable
        columns={columns}
        rows={stores}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key, order) => {
          setSortBy(key);
          setSortOrder(order);
        }}
      />
    </Layout>
  );
}
