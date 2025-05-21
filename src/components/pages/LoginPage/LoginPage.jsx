import LoginImage from "../../../assets/loginmiage.jpg";
import { Link } from "react-router-dom";

const LoginForm = () => {
    return (
        <div>
            <div className="w-full h-screen flex items-start">
                <div className="relative w-1/2 h-full flex flex-col">
                    <img src={LoginImage} className="w-full h-full" alt="Pet Dog" />
                </div>
                <div className="w-1/2 h-full bg-[#fff] flex flex-col p-20 justify-between items-center">
                    <Link to="/" className="w-full max-w-[550px] mx-auto text-xl text-[#373E79] font-semibold ">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-600">TMSS</span>
                            </h1>
                        </div>
                        <h1 >
                            Bệnh viện chữa bệnh HIV tốt nhất
                        </h1>
                    </Link>
                    <div className="w-full flex flex-col max-w-[550px]">
                        <div className="w-full flex flex-col mb-2">
                            <h3 className="text-4xl font-semibold mb-2 text-[#373E79] ">Đăng nhập</h3>
                            <p className="text-base mb-2 text-[#373E79]">
                                Chào mừng bạn trở lại !! Vui lòng điền thông tin của bạn.
                            </p>
                        </div>

                        <form className="w-full flex flex-col">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                                autoComplete="email"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                                autoComplete="current-password"
                            />

                            <div className="w-full flex items-center justify-between">
                                <div className="w-full flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 mr-2"
                                    />
                                    <p className="text-sm text-[#373E79]">Nhớ tôi cho lần sau</p>
                                </div>
                                <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-[#373E79]">
                                    Quên mật khẩu?
                                </p>
                            </div>

                            <div className="w-full flex flex-col my-4">
                                <button
                                    type="button"
                                    className="w-full text-[#FFFCF7] my-2 bg-[#4763E6] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                                >
                                    Đăng nhập
                                </button>

                            </div>
                        </form>

                        <div className="w-full flex items-center justify-center relative py-2">
                            <div className="w-full h-[1px] bg-black"></div>
                            <p className="text-lg absolute text-black/80 bg-[#f5f5f5] px-2 text-[#373E79]"></p>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-center">
                        <p className="text-sm font-normal text-[#373E79]">
                            Không có tài khoản?{" "}
                            <Link to="/register">
                                <span className="font-semibold underline underline-offset-2 cursor-pointer text-[#373E79]">
                                    Hãy đăng kí
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
