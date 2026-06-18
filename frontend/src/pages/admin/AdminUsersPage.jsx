import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';
import FilterBar from '../../components/FilterBar';
import SortableTable from '../../components/SortableTable';
import { formatRole } from '../../utils/validation';

const FILTER_FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'ADMIN', label: 'System Administrator' },
      { value: 'USER', label: 'Normal User' },
      { value: 'STORE_OWNER', label: 'Store Owner' },
    ],
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const endpoint = viewAll ? '/admin/users/all' : '/admin/users';
      const { data } = await api.get(endpoint, {
        params: { ...filters, sortBy, sortOrder },
      });
      setUsers(data.users);
      setError('');
    } catch {
      setError('Failed to load users');
    }
  }, [filters, sortBy, sortOrder, viewAll]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => formatRole(row.role),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <Link to={`/admin/users/${row.id}`}>View Details</Link>,
    },
  ];

  return (
    <Layout title={viewAll ? 'All Users' : 'Users (Admin & Normal)'}>
      <div className="page-toolbar">
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setViewAll((prev) => !prev)}
        >
          {viewAll ? 'Show Admin & Normal Users' : 'Show All Users'}
        </button>
        <Link to="/admin/users/new" className="btn btn-primary">
          Add User
        </Link>
      </div>
      <FilterBar
        filters={filters}
        fields={FILTER_FIELDS}
        onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onReset={() => setFilters({ name: '', email: '', address: '', role: '' })}
      />
      {error && <p className="error-msg">{error}</p>}
      <SortableTable
        columns={columns}
        rows={users}
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
