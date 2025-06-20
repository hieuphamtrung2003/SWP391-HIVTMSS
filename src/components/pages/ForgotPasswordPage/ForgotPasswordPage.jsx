import { useState } from "react";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email của bạn", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "api/v1/auth/forgot-password",
                null,
                {
                    params: {
                        email: email
                    }
                }
            );

            if (response.http_status === 200) {
                toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!", {
                    position: "top-right",
                    autoClose: 5000,
                });
                setEmail("");
                // Navigate to reset password page after successful request
                navigate("/reset-password");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Image */}
                    <div className="w-1/2 hidden md:flex bg-blue-50">
                        <img
                            src={LoginImage}
                            className="w-full h-full object-cover self-stretch"
                            alt="Pet Dog"
                        />
                    </div>

                    {/* Form content */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <Link to="/" className="text-left mb-6 text-xl font-semibold text-[#373E79]">
                            <h1 className="text-2xl font-bold text-blue-600 mb-1">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-600">TMSS</span>
                            </h1>
                            <p className="text-sm">Bệnh viện chữa bệnh HIV tốt nhất</p>
                        </Link>

                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-[#373E79] mb-1">Quên mật khẩu?</h3>
                            <p className="text-sm text-[#373E79]">
                                Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu
                            </p>
                        </div>

                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                autoComplete="email"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-[#4763E6] text-white py-3 rounded-md mt-6 hover:bg-[#3a52c9] transition disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Gửi liên kết"}
                            </button>
                        </form>

                        <div className="w-full my-6">
                            <div className="h-[0.5px] bg-black w-full" />
                        </div>

                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-normal text-[#373E79]">
                                <Link to="/login">
                                    <span className="font-semibold underline underline-offset-2 cursor-pointer text-[#373E79]">
                                        Quay về trang đăng nhập
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;