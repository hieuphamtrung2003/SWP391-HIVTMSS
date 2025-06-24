import { useState } from "react";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const LoginForm = () => {

    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        // Chưa điền password
        if (!formValue.password.trim()) {
            toast.error("Bạn chưa điền mật khẩu");
            return;
        }
        // Chưa điền email
        if (!formValue.email.trim()) {
            toast.error("Bạn chưa điền email");
            return;
        }

        try {
            const res = await axios.post("api/v1/auth/login", formValue);
            console.log(res);
            if (res?.http_status === 200) {
                const token = res.data.access_token;
                localStorage.setItem("access_token", token);

                const decodedToken = decodeToken(token);
                if (!decodedToken) {
                    toast.error("Token không hợp lệ hoặc đã hết hạn!");
                    return;
                }

                const role = decodedToken.role;
                localStorage.setItem("role", role)
                // Điều hướng theo phân quyền
                if (role === "ADMIN") {
                    window.location.href = "/admin/profile";
                } else if (role === "MANAGER") {
                    window.location.href = "/manager";
                } else if (role === "CUSTOMER") {
                    window.location.href = "/schedule";
                }
                else if (role === "DOCTOR") {
                    try {
                        const degreeRes = await axios.get(`/api/doctor-degrees/account/${decodedToken.id}`);

                        if (degreeRes) {
                            // Nếu đã có bằng cấp
                            window.location.href = "/doctor/patient-request";
                        } else {
                            // Không có bằng cấp
                            window.location.href = "/doctor/degree";
                        }
                    } catch (err) {
                        console.error("Error fetching doctor degree:", err);
                        window.location.href = "/doctor/degree";
                        return;
                    }
                } else {
                    toast.error("Vai trò không được hỗ trợ!");
                    return;
                }
                toast.success("Đăng nhập thành công!!");
            } else {
                toast.error("Vui lòng kiểm tra lại email hoặc mật khẩu !!");
            }
        } catch (error) {
            // Password sai
            toast.error("Email hoặc mật khẩu không đúng!");
            console.error("Login failed:", error);
        }
    };

    //hiện password
    const [showPassword, setShowPassword] = useState(false);

    // const [view, setViewPassword] = useState(false);
    // const icon =


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Ảnh bên trái */}
                <div className="hidden md:block bg-blue-100">
                    <img
                        src={LoginImage}
                        alt="Login"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Nội dung form bên phải */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                    {/* Logo và mô tả */}
                    <Link to="/" className="font-semibold text-[#373E79]">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-blue-700">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-500">TMSS</span>
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Bệnh viện chữa trị HIV hàng đầu
                            </p>
                        </div>
                    </Link>

                    {/* Tiêu đề form */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Đăng nhập</h2>
                        <p className="text-sm text-gray-500">Vui lòng nhập thông tin để tiếp tục</p>
                    </div>

                    {/* Form nhập */}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={formValue.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mật khẩu"
                                autoComplete="current-password"
                                value={formValue.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Ghi nhớ và quên mật khẩu */}
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input type="checkbox" />
                                Nhớ tôi
                            </label>
                            <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Nút login */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* Dòng kẻ và đăng ký */}
                    <div className="my-6">
                        <div className="h-px bg-gray-200 w-full" />
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );


};

export default LoginForm;
