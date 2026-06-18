import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validation';

export default function AdminAddUserPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setError('');
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    const filtered = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value)
    );
    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped = {};
        apiErrors.forEach((item) => {
          mapped[item.path] = item.msg;
        });
        setErrors(mapped);
      } else {
        setError(err.response?.data?.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add User">
      <Link to="/admin/users" className="btn btn-secondary">
        Back to Users
      </Link>
      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>
          Address
          <textarea
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
            <option value="USER">Normal User</option>
            <option value="ADMIN">System Administrator</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </Layout>
  );
}
