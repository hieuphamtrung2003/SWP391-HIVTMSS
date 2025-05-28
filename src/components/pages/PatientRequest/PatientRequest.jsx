import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, AlertCircle, Check, X, MessageSquare } from 'lucide-react';

const PatientRequestsManager = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientId: "BN001",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      requestType: "Khám bệnh định kỳ",
      preferredDate: "2025-05-30",
      preferredTime: "09:00",
      symptoms: "Đau đầu, mệt mỏi, cần tái khám theo lịch điều trị ARV",
      isAnonymous: false,
      priority: "medium",
      requestDate: "2025-05-27",
      status: "pending"
    },
    {
      id: 2,
      patientName: "Bệnh nhân ẩn danh",
      patientId: "ANON002",
      phone: "Không hiển thị",
      email: "Không hiển thị",
      requestType: "Tư vấn trực tuyến",
      preferredDate: "2025-05-28",
      preferredTime: "14:00",
      symptoms: "Cần tư vấn về tác dụng phụ của thuốc ARV, lo lắng về việc điều trị",
      isAnonymous: true,
      priority: "high",
      requestDate: "2025-05-27",
      status: "pending"
    },
    {
      id: 3,
      patientName: "Trần Thị B",
      patientId: "BN003",
      phone: "0912345678",
      email: "tranthib@email.com",
      requestType: "Xét nghiệm CD4",
      preferredDate: "2025-05-29",
      preferredTime: "08:30", 
      symptoms: "Cần xét nghiệm CD4 định kỳ theo phác đồ điều trị, hiện tại đang dùng TDF + 3TC + DTG",
      isAnonymous: false,
      priority: "low",
      requestDate: "2025-05-26",
      status: "pending"
    }
  ]);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const commonDeclineReasons = [
    "Lịch làm việc đã đầy",
    "Cần thêm thông tin từ bệnh nhân",
    "Yêu cầu chuyển khoa khác",
    "Cần xét nghiệm bổ sung trước khám",
    "Thời gian không phù hợp",
    "Khác (nhập lý do)"
  ];

  const priorityColors = {
    high: "border-l-red-500 bg-red-50",
    medium: "border-l-yellow-500 bg-yellow-50", 
    low: "border-l-green-500 bg-green-50"
  };

  const priorityLabels = {
    high: "Ưu tiên cao",
    medium: "Ưu tiên trung bình",
    low: "Ưu tiên thấp"
  };

  const handleAccept = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleDeclineClick = (request) => {
    setSelectedRequest(request);
    setShowDeclineModal(true);
    setDeclineReason('');
    setCustomReason('');
  };

  const handleDeclineConfirm = () => {
    if (!declineReason && !customReason) return;
    
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'declined',
            declineReason: declineReason === 'Khác (nhập lý do)' ? customReason : declineReason
          } 
        : req
    ));
    
    setShowDeclineModal(false);
    setSelectedRequest(null);
    setDeclineReason('');
    setCustomReason('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yêu cầu khám bệnh</h1>
              <p className="text-gray-600 mt-1">Quản lý các yêu cầu khám bệnh từ bệnh nhân</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-semibold">{pendingRequests.length}</span>
                <span className="text-blue-600 ml-1">yêu cầu chờ xử lý</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div 
              key={request.id} 
              className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[request.priority]} p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Patient Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {request.patientName}
                      </span>
                      {request.isAnonymous && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          Ẩn danh
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500">ID: {request.patientId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.priority === 'high' ? 'bg-red-100 text-red-800' :
                      request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {priorityLabels[request.priority]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Contact Info */}
                    {!request.isAnonymous && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{request.email}</span>
                        </div>
                      </div>
                    )}

                    {/* Appointment Details */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Ngày mong muốn: {formatDate(request.preferredDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Thời gian: {formatTime(request.preferredTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Type & Symptoms */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Loại yêu cầu: </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {request.requestType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Triệu chứng/Ghi chú:</span>
                      <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                        {request.symptoms}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Yêu cầu được gửi: {formatDate(request.requestDate)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Chấp nhận</span>
                  </button>
                  <button
                    onClick={() => handleDeclineClick(request)}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Từ chối</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu mới</h3>
              <p className="text-gray-600">Tất cả yêu cầu khám bệnh đã được xử lý.</p>
            </div>
          )}
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Từ chối yêu cầu khám bệnh</h3>
                <p className="text-sm text-gray-500">
                  Bệnh nhân: {selectedRequest?.patientName}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối *
              </label>
              <div className="space-y-2">
                {commonDeclineReasons.map((reason) => (
                  <label key={reason} className="flex items-center">
                    <input
                      type="radio"
                      name="declineReason"
                      value={reason}
                      checked={declineReason === reason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              {declineReason === 'Khác (nhập lý do)' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeclineConfirm}
                disabled={!declineReason || (declineReason === 'Khác (nhập lý do)' && !customReason.trim())}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRequestsManager;