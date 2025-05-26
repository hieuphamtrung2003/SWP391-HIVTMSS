
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link } from "react-router-dom";
const RegisterForm = () => {
    return (
        <div>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">

                    {/* Ảnh */}
                    <div className="w-1/2 hidden md:flex bg-blue-50">
                        <img
                            src={LoginImage}
                            className="w-full h-full object-cover self-stretch"
                            alt="Pet Dog"
                        />
                    </div>
                    {/* Nội dung form register */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <Link to="/" className="text-left mb-6 text-xl font-semibold text-[#373E79]">
                            <h1 className="text-2xl font-bold text-blue-600 mb-1">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-600">TMSS</span>
                            </h1>
                            <p className="text-sm">Bệnh viện chữa bệnh HIV tốt nhất</p>
                        </Link>

                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-[#373E79] mb-1">Đăng kí</h3>
                            <p className="text-sm text-[#373E79]">Bạn chưa có tài khoản !! Vui lòng điền thông tin của bạn để đăng ký.</p>
                        </div>

                        <form className="flex flex-col">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                autoComplete="email"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                autoComplete="current-password"
                            />

                            <input
                                type="text"
                                name="text"
                                placeholder="Số điện thoại"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"

                            />
                            <input
                                type="text"
                                name="text"
                                placeholder="Ngày sinh"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"

                            />

                            <button
                                type="button"
                                className="w-full bg-[#4763E6] text-white py-3 rounded-md mt-6 hover:bg-[#3a52c9] transition"
                            >
                                Đăng kí
                            </button>
                        </form>


                        <div className="w-full my-6">
                            <div className="h-[0.5px] bg-black w-full" />
                        </div>


                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-normal text-[#373E79]">
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login">
                                    <span className="font-semibold underline underline-offset-2 cursor-pointer text-[#373E79]">
                                        Hãy đăng nhập
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

export default RegisterForm;
