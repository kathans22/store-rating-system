import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';
import { formatRole } from '../../utils/validation';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then(({ data }) => setUser(data.user))
      .catch(() => setError('Failed to load user details'));
  }, [id]);

  return (
    <Layout title="User Details">
      <Link to="/admin/users" className="btn btn-secondary">
        Back to Users
      </Link>
      {error && <p className="error-msg">{error}</p>}
      {user && (
        <div className="card detail-card">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Role:</strong> {formatRole(user.role)}
          </p>
          {user.role === 'STORE_OWNER' && (
            <p>
              <strong>Store Rating:</strong>{' '}
              {user.storeRating !== null ? user.storeRating.toFixed(2) : 'No ratings yet'}
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}
