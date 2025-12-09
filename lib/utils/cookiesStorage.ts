export const cookieStorage = {
  set(email: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${email}=${value}; expires=${expires}; path=/`;
  },

  get(email: string) {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${email}=`))
      ?.split('=')[1];
  },

  remove(email: string) {
    document.cookie = `${email}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};
