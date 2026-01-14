export const userRole = {
  User: 'user',
  Admin: 'admin',
} as const;

export const authTypes = {
  Password: 'password',
  Google: 'google',
  Facebook: 'facebook',
  Apple: 'apple',
} as const;

export const accountStatus = {
  Active: 'active',
  Suspended: 'suspended',
  Deleted: 'deleted',
  Inactive: 'inactive',
} as const;
