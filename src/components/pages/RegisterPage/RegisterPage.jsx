
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios"
import { toast } from "react-toastify";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Hình ảnh */}
                <div className="hidden md:block bg-blue-100">
                    <img
                        src={LoginImage}
                        alt="Register Illustration"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Form đăng ký */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                    {/* Logo */}
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
    );

};

export default RegisterForm;
