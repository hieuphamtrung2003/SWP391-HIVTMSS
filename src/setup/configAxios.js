import axios from 'axios';
import { toast } from 'react-toastify';

// Tạo instance axios với cấu hình mặc định
const instance = axios.create({
  baseURL: 'https://swp391.tinhvv.xyz/',
});
instance.defaults.withCredentials = true;
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

    // if (!isToastShown) {
    //   isToastShown = true;
    //   toast.error('Phiên bản đã hết hạn xin hãy đăng nhập lại');
    //   localStorage.removeItem('access_token');
    //   localStorage.removeItem('refresh_token');
    //   window.location.href = '/login';
    // }

    return Promise.reject(error);
  }
);

export default instance;
