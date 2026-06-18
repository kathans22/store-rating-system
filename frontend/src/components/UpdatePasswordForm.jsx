import { useState } from 'react';
import api from '../services/api';
import { validatePassword } from '../utils/validation';

export default function UpdatePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!form.currentPassword) nextErrors.currentPassword = 'Current password is required';
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) nextErrors.newPassword = passwordError;
    if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <label>
        Current Password
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) => handleChange('currentPassword', e.target.value)}
        />
        {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
      </label>
      <label>
        New Password
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
        />
        {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
      </label>
      <label>
        Confirm New Password
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
      </label>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}
