export const getUser = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return { token, role };
  };
  