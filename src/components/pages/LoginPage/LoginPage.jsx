import { useState } from "react";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";
import { FaEye, FaEyeSlash, FaUserMd, FaShieldAlt, FaHeartbeat } from "react-icons/fa";


const LoginForm = () => {
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);

        try {
            const res = await axios.post("api/v1/auth/login", formValue);
            console.log(res);
            if (res?.http_status === 200) {
                const token = res.data.access_token;
                localStorage.setItem("access_token", token);

                const decodedToken = decodeToken(token);
                if (!decodedToken) {
                    toast.error("Token không hợp lệ hoặc đã hết hạn!");
                    setIsLoading(false);
                    return;
                }

                const role = decodedToken.role;
                localStorage.setItem("role", role);

                toast.success("Đăng nhập thành công!!");


                setTimeout(() => {
                    // Điều hướng theo phân quyền
                    if (role === "ADMIN") {
                        window.location.href = "/admin/profile";
                    } else if (role === "MANAGER") {
                        window.location.href = "/manager/profile";
                    } else if (role === "CUSTOMER") {
                        window.location.href = "/schedule";
                    } else if (role === "DOCTOR") {
                        handleDoctorRedirect(decodedToken.id);
                    } else {
                        toast.error("Vai trò không được hỗ trợ!");
                        setIsLoading(false);
                        return;
                    }
                }, 1000);
            } else {
                toast.error("Vui lòng kiểm tra lại email hoặc mật khẩu !!");
                setIsLoading(false);
            }
        } catch (error) {
            // Password sai
            toast.error("Email hoặc mật khẩu không đúng!");
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    };

    const handleDoctorRedirect = async (doctorId) => {
        try {
            const degreeRes = await axios.get(`/api/doctor-degrees/account/${doctorId}`);

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
        }
    };

    // hiện password
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-green-100">
                {/* Floating medical icons */}
                <div className="absolute top-20 left-10 text-blue-200 opacity-70 animate-pulse">
                    <FaHeartbeat className="w-16 h-16" />
                </div>
                <div className="absolute top-40 right-20 text-green-200 opacity-70 animate-pulse delay-1000">
                    <FaShieldAlt className="w-12 h-12" />
                </div>
                <div className="absolute bottom-32 left-20 text-blue-200 opacity-70 animate-pulse delay-500">
                    <FaUserMd className="w-14 h-14" />
                </div>
                <div className="absolute bottom-20 right-10 text-green-200 opacity-70 animate-pulse delay-700">
                    <FaHeartbeat className="w-10 h-10" />
                </div>
                <div className="absolute top-1/2 left-1/4 text-blue-200 opacity-70 animate-pulse delay-300">
                    <FaShieldAlt className="w-8 h-8" />
                </div>
                <div className="absolute top-1/3 right-1/4 text-green-200 opacity-70 animate-pulse delay-800">
                    <FaUserMd className="w-10 h-10" />
                </div>

                {/* Abstract medical pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100 to-transparent transform rotate-12"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-100 to-transparent transform -rotate-12"></div>
                </div>

                {/* Floating circles */}
                <div className="absolute top-10 right-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-green-100 rounded-full opacity-70 animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-70 animate-pulse delay-1000"></div>
            </div>

            {/* Original Content with relative positioning */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                            </div>
                            <p className="text-gray-700 font-medium">Đang tải...</p>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side - Medical Info */}
                    <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-l-3xl relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                            <div className="absolute bottom-20 right-15 w-24 h-24 border-2 border-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="text-center text-white space-y-6 relative z-10">
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <FaShieldAlt className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Chăm sóc sức khỏe</h2>
                                <p className="text-blue-100 text-lg">An toàn - Chuyên nghiệp - Hiệu quả</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-blue-100">Tư vấn chuyên khoa HIV</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-blue-100">Bảo mật thông tin tuyệt đối</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-blue-100">Đội ngũ bác sĩ giàu kinh nghiệm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nội dung form bên phải */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                        {/* Logo và mô tả */}
                        <div className="font-semibold text-[#373E79]">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-blue-700">
                                    <Link to="/" className="font-semibold text-[#373E79]">
                                        <span className="text-blue-800">HIV</span>
                                        <span className="text-blue-500">TMSS</span>
                                    </Link>
                                </h1>

                                <p className="text-sm text-gray-600 mt-1">
                                    Bệnh viện chữa trị HIV hàng đầu
                                </p>
                            </div>
                        </div>

                        {/* Tiêu đề form */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Đăng nhập</h2>
                            <p className="text-sm text-gray-500">Vui lòng nhập thông tin để tiếp tục</p>
                        </div>

                        {/* Form nhập */}
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    value={formValue.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => !isLoading && setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* Ghi nhớ và quên mật khẩu */}
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                </label>
                                <a
                                    href="/forgot-password"
                                    className={`text-blue-600 hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Nút login */}
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>
                        </div>

                        {/* Dòng kẻ và đăng ký */}
                        <div className="my-6">
                            <div className="h-px bg-gray-200 w-full" />
                        </div>
                        <p className="text-center text-sm text-gray-600">
                            Chưa có tài khoản?{" "}
                            <a
                                href="/register"
                                className={`text-blue-600 hover:underline font-medium ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;