import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!email || !verificationCode || !password || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ các trường", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        if (password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "api/v1/auth/reset-password",
                null, // No request body
                {
                    params: {
                        Email: email,
                        Password: password,
                        token: verificationCode
                    }
                }
            );

            if (response.http_status === 200) {
                toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.", {
                    position: "top-right",
                    autoClose: 5000,
                });
                navigate("/login");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";

            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = "Mã xác minh không hợp lệ hoặc đã hết hạn";
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };
    //hiện password
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Hình ảnh minh họa */}
                <div className="hidden md:block bg-blue-100">
                    <img
                        src={LoginImage}
                        alt="Reset Password"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Nội dung form */}
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
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Đặt lại mật khẩu</h2>
                        <p className="text-sm text-gray-500">Nhập thông tin bên dưới để tạo mật khẩu mới</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email đã đăng ký"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="email"
                            required
                        />

                        <input
                            type="text"
                            name="verificationCode"
                            placeholder="Mã xác nhận (6 ký tự)"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={6}
                            required
                        />

                        {/* Mật khẩu mới */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="confirm-new-password"
                            minLength={6}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>

                    {/* Gạch ngăn cách */}
                    <div className="my-6">
                        <div className="h-px bg-gray-200 w-full" />
                    </div>

                    {/* Link về login */}
                    <p className="text-center text-sm text-gray-600">
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Quay về trang đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default ResetPasswordForm;