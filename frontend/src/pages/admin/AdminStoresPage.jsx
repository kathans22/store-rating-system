import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';
import FilterBar from '../../components/FilterBar';
import SortableTable from '../../components/SortableTable';

const FILTER_FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
];

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stores', {
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
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => (row.rating !== null ? row.rating.toFixed(2) : 'N/A'),
    },
  ];

  return (
    <Layout title="Stores">
      <div className="page-toolbar">
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
        <Link to="/admin/stores/new" className="btn btn-primary">
          Add Store
        </Link>
      </div>
      <FilterBar
        filters={filters}
        fields={FILTER_FIELDS}
        onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onReset={() => setFilters({ name: '', email: '', address: '' })}
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
