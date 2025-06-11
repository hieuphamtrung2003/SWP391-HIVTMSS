// src/features/booking/BookingPage.js
import React, { useState } from 'react';
import { Calendar, Clock, User, Shield, Heart, Phone, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toast } from 'react-toastify';
import useBookingStore from '../stores/bookingStore';

const BookingPage = () => {
  const {
    availableDoctors,
    selectedDoctor,
    appointmentData,
    isLoading,
    error,
    setSelectedDoctor,
    updateAppointmentData,
    fetchAvailableDoctors,
    createAppointment
  } = useBookingStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle date/time change to fetch available doctors
  const handleDateTimeChange = async (dateTime) => {
    updateAppointmentData({ start_time: dateTime });
    if (dateTime) {
      await fetchAvailableDoctors(dateTime);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAppointment();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(1);
        // Reset form
        updateAppointmentData({
          gender: '',
          dob: '',
          first_name: '',
          last_name: '',
          start_time: '',
          chief_complaint: '',
          is_pregnant: false,
          is_anonymous: false
        });
        setSelectedDoctor(null);
      }, 3000);
    } catch (error) {
      toast.error('đặt lịch thất bại:');
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get minimum datetime for appointment
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // At least 1 hour from now
    return now.toISOString().slice(0, 16);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
          <p className="text-gray-600">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Đặt Lịch Khám HIV</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đặt lịch hẹn với bác sĩ chuyên khoa để được tư vấn và điều trị HIV một cách an toàn, bảo mật
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  Thông Tin Cá Nhân
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ *
                    </label>
                    <input
                      type="text"
                      required
                      value={appointmentData.first_name}
                      onChange={(e) => updateAppointmentData({ first_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={appointmentData.last_name}
                      onChange={(e) => updateAppointmentData({ last_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính *
                    </label>
                    <select
                      required
                      value={appointmentData.gender}
                      onChange={(e) => updateAppointmentData({ gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh *
                    </label>
                    <input
                      type="date"
                      required
                      max={getMinDate()}
                      value={appointmentData.dob}
                      onChange={(e) => updateAppointmentData({ dob: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Triệu chứng chính / Lý do khám
                  </label>
                  <textarea
                    value={appointmentData.chief_complaint}
                    onChange={(e) => updateAppointmentData({ chief_complaint: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả triệu chứng hoặc lý do muốn khám..."
                  />
                </div>

                <div className="space-y-4">
                  {appointmentData.gender === 'FEMALE' && (
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={appointmentData.is_pregnant}
                        onChange={(e) => updateAppointmentData({ is_pregnant: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Tôi đang mang thai</span>
                    </label>
                  )}

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={appointmentData.is_anonymous}
                      onChange={(e) => updateAppointmentData({ is_anonymous: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Tôi muốn đặt lịch ẩn danh
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Tiếp theo
                </button>
              </div>
            )}

            {/* Step 2: Date, Time & Doctor Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  Chọn Thời Gian & Bác Sĩ
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian khám *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    min={getMinDateTime()}
                    value={appointmentData.start_time}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Đang tải danh sách bác sĩ...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {availableDoctors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Chọn bác sĩ *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableDoctors.map((doctor) => (
                        <motion.div
                          key={doctor.doctor_id}
                          whileHover={{ scale: 1.02 }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedDoctor?.doctor_id === doctor.doctor_id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{doctor.full_name}</h3>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {doctor.phone}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">{doctor.gender.toLowerCase()}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedDoctor}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Check className="w-6 h-6 mr-2 text-blue-600" />
                  Xác Nhận Thông Tin
                </h2>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Thông tin bệnh nhân</h4>
                      <p className="text-gray-600">
                        {appointmentData.first_name} {appointmentData.last_name}
                      </p>
                      <p className="text-gray-600">
                        {appointmentData.gender === 'MALE' ? 'Nam' : appointmentData.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                      </p>
                      <p className="text-gray-600">Sinh: {appointmentData.dob}</p>
                      {appointmentData.is_anonymous && (
                        <p className="text-blue-600 flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Khám ẩn danh
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">Thông tin khám</h4>
                      <p className="text-gray-600">
                        {new Date(appointmentData.start_time).toLocaleString('vi-VN')}
                      </p>
                      <p className="text-gray-600">Bác sĩ: {selectedDoctor?.full_name}</p>
                      <p className="text-gray-600">SĐT: {selectedDoctor?.phone}</p>
                    </div>
                  </div>

                  {appointmentData.chief_complaint && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Triệu chứng/Lý do khám</h4>
                      <p className="text-gray-600">{appointmentData.chief_complaint}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Vui lòng đến trước giờ hẹn 15 phút</li>
                        <li>Mang theo CCCD/CMND và sổ khám bệnh (nếu có)</li>
                        <li>Thông tin của bạn được bảo mật tuyệt đối</li>
                        <li>Có thể hủy/đổi lịch trước 2 giờ</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-600"
        >
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-4 h-4 mr-1" />
            <span>Thông tin của bạn được bảo vệ bởi chính sách bảo mật nghiêm ngặt</span>
          </div>
          <p>Chúng tôi cam kết không chia sẻ thông tin cá nhân với bên thứ ba</p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;