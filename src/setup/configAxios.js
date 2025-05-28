import axios from 'axios';
import { toast } from 'react-toastify';

// Tạo instance axios với cấu hình mặc định
const instance = axios.create({
  baseURL: 'http://103.179.185.77:8080/',
});
instance.defaults.withCredentials = true;

// Hàm refresh token
// const refreshToken = async () => {
//   try {
//     const refresh_token = localStorage.getItem('refresh_token');
//     if (!refresh_token) {
//       throw new Error('No refresh token found');
//     }

//     const response = await axios.post(
//       'https://souvi-be-v1.onrender.com/auth/refresh-token',
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${refresh_token}`,
//         },
//       }
//     );

//     const access_token = response.data.data.access_token;

//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('refresh_token', response.data.data.refresh_token);

//     return access_token;
//   } catch (error) {
//     console.error('Failed to refresh token:', error);
//     return null;
//   }
// };

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response
let isToastShown = false;

instance.interceptors.response.use(
  (response) => {
    isToastShown = false;
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !isToastShown) {
      isToastShown = true;
      toast.error('Phiên bản đã hết hạn xin hãy đăng nhập lại');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;
