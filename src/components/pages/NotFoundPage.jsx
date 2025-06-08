import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 px-5">
            <h1 className="text-7xl font-bold text-blue-600">404</h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-4">
                Trang không tồn tại
            </p>
            <p className="text-gray-600 mt-2 text-center">
                Rất tiếc! Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
            </p>
            <Link
                to="/"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Quay về trang chủ
            </Link>
        </div>
    );
};

export default NotFound;

