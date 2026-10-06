const request = async (path, options = {}) => {
  try {
    const response = await fetch(`/api${path}`, {
      credentials: 'include',
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getTracks = () => request('/music/');
export const getMe = () => request('/auth/me');
export const login = body => request('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
export const register = body => request('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});
export const logout = () => request('/auth/logout', { method: 'POST' });
export const uploadTrack = file => {
  const body = new FormData();
  body.append('file', file);
  return request('/music/upload', { method: 'POST', body });
};
