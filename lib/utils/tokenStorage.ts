export const setTokens = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

export const getTokens = () => {
  localStorage.getItem('accessToken');
  localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
