import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios"
import { toast } from "react-toastify";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserMd, FaShieldAlt, FaHeartbeat } from "react-icons/fa";

const RegisterForm = () => {

    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { first_name, last_name, email, password, phone, address } = formValue;

        // Kiểm tra rỗng
        if (!first_name.trim() || !last_name.trim() || !email.trim() || !password.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            const res = await axios.post("/api/v1/auth/register", formValue);
            if (res?.http_status === 200) {
                toast.success("Đăng ký thành công!");
                navigate("/login");
            } else {
                toast.error("Đăng ký không thành công. Vui lòng thử lại!");
            }
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                toast.error(message || "Lỗi từ máy chủ. Đăng ký thất bại!");
            } else {
                toast.error("Không thể kết nối đến máy chủ!");
            }
            console.error("Đăng ký thất bại:", error);
        }
    };

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

                    {/* Form đăng ký */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                        {/* Logo và mô tả */}
                        <div className="font-semibold text-[#373E79]">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-blue-700">
                                    <a
                                        href="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = "/";
                                        }}
                                        className="font-semibold text-[#373E79]"
                                    >
                                        <span className="text-blue-800">HIV</span>
                                        <span className="text-blue-500">TMSS</span>
                                    </a>

                                </h1>

                                <p className="text-sm text-gray-600 mt-1">
                                    Bệnh viện chữa trị HIV hàng đầu
                                </p>
                            </div>
                        </div>

                        {/* Tiêu đề */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Đăng ký</h2>
                            <p className="text-sm text-gray-500">Vui lòng nhập thông tin để tạo tài khoản</p>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleRegister}>
                            {/* Họ và tên */}
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Họ"
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formValue.first_name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Tên"
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formValue.last_name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formValue.email}
                                onChange={handleChange}
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mật khẩu"
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formValue.password}
                                    onChange={handleChange}
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            {/* Phone */}
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Số điện thoại"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formValue.phone}
                                onChange={handleChange}
                            />

                            {/* Địa chỉ */}
                            <input
                                type="text"
                                name="address"
                                placeholder="Địa chỉ"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formValue.address}
                                onChange={handleChange}
                            />

                            {/* Nút đăng ký */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                            >
                                Đăng ký
                            </button>
                        </form>

                        {/* Kẻ ngang */}
                        <div className="my-6">
                            <div className="h-px bg-gray-200 w-full" />
                        </div>

                        {/* Link sang login */}
                        <p className="text-center text-sm text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default RegisterForm;