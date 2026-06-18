import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/stores');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped = {};
        apiErrors.forEach((item) => {
          mapped[item.path] = item.msg;
        });
        setErrors(mapped);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Register as a normal user</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name (20-60 characters)
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
            Address (max 400 characters)
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>
          <label>
            Password (8-16 chars, uppercase + special)
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
