export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export function validateName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 20) return 'Name must be at least 20 characters';
  if (trimmed.length > 60) return 'Name must not exceed 60 characters';
  return '';
}

export function validateEmail(email) {
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return 'Must be a valid email address';
  return '';
}

export function validateAddress(address) {
  const trimmed = address.trim();
  if (!trimmed) return 'Address is required';
  if (trimmed.length > 400) return 'Address must not exceed 400 characters';
  return '';
}

export function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character';
  }
  return '';
}

export function formatRole(role) {
  const map = {
    ADMIN: 'System Administrator',
    USER: 'Normal User',
    STORE_OWNER: 'Store Owner',
  };
  return map[role] || role;
}

export function getDashboardPath(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'STORE_OWNER':
      return '/owner/dashboard';
    default:
      return '/stores';
  }
}
