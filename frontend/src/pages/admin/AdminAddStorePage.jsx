import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/Layout';
import { validateAddress, validateEmail } from '../../utils/validation';

export default function AdminAddStorePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/admin/store-owners')
      .then(({ data }) => setOwners(data.owners))
      .catch(() => setError('Failed to load store owners'));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setError('');
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Store name is required';
    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;
    const addressError = validateAddress(form.address);
    if (addressError) nextErrors.address = addressError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/admin/stores', {
        ...form,
        ownerId: form.ownerId ? Number(form.ownerId) : null,
      });
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add Store">
      <Link to="/admin/stores" className="btn btn-secondary">
        Back to Stores
      </Link>
      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Store Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Store Email
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
          Store Owner (optional)
          <select value={form.ownerId} onChange={(e) => handleChange('ownerId', e.target.value)}>
            <option value="">No owner assigned</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </Layout>
  );
}
