import { useState, useEffect } from 'react';
import axios from 'setup/configAxios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "../../ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from 'react-toastify';

const DoctorTreatmentPage = () => {
    const { appointmentId } = useParams();
    const [testTypes, setTestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [patientInfo, setPatientInfo] = useState(null);
    const [appointmentInfo, setAppointmentInfo] = useState(null);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    // Initial form state
    const initialFormData = {
        result: 'POSITIVE',
        cd4: '',
        note: '',
        test_type_id: '',
        sample_type: 'WHOLE_BLOOD',
        result_type: 'PRELIMINARY',
        virus_type: 'HIV_1',
        ag_ab_result: 'POSITIVE',
        viral_load: '',
        pcr_type: 'DNA',
        clinical_stage: 'STAGE_I'
    };

    const [formData, setFormData] = useState(initialFormData);

    // Get the selected test type details
    const selectedTestType = formData.test_type_id
        ? testTypes.find(test => test.test_type_id === parseInt(formData.test_type_id))
        : null;

    // Determine which fields to show based on test type
    const getFieldsToShow = () => {
        if (!selectedTestType) return [];
        
        const testName = selectedTestType.test_type_name.toLowerCase();
        
        if (testName.includes('screening')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'agAbResult'];
        } else if (testName.includes('confirmatory')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'virusType', 'result'];
        } else if (testName.includes('pcr')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'pcrType', 'viralLoad', 'result'];
        } else if (testName.includes('western bolt test')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'result', 'virusType'];
        } else if (testName.includes('giúp xác định')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'viralLoad', 'result'];
        } else if (testName.includes('cd4')) {
            return ['sampleType', 'clinicalStage', 'resultType', 'cd4'];
        }
        return [];
    };

    const fieldsToShow = getFieldsToShow();

    // Fetch test types and patient/appointment info
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch test types
                const testTypesResponse = await axios.get('/api/v1/test-types/all');

                // Check if response has data array
                if (!testTypesResponse.data || !Array.isArray(testTypesResponse.data)) {
                    toast.error('Invalid test types data format');
                }

                // Only include active test types
                const activeTestTypes = testTypesResponse.data.filter(
                    test => test.is_active === 'ACTIVE'
                );
                setTestTypes(activeTestTypes);

                // Fetch appointment info
                const appointmentResponse = await axios.get(`/api/v1/appointments?appointmentId=${appointmentId}`);

                if (!appointmentResponse.data) {
                    toast.error('Invalid appointment data');
                }

                const appointmentData = appointmentResponse.data;
                setAppointmentInfo({
                    date: new Date(appointmentData.start_time).toLocaleDateString(),
                    reason: appointmentData.chief_complaint || 'Khám tổng quát',
                    medicalHistory: appointmentData.medical_history || 'Không có'
                });

                // Set patient info
                setPatientInfo({
                    name: appointmentData.is_anonymous ? 'Bệnh nhân ẩn danh' : appointmentData.full_name,
                    id: appointmentData.customer?.customer_id || 'N/A',
                    gender: appointmentData.gender === 'MALE' ? 'Nam' : 'Nữ',
                    dob: new Date(appointmentData.dob).toLocaleDateString(),
                    phone: appointmentData.customer?.phone || 'N/A'
                });

            } catch (err) {
                toast.error('Error fetching data:', err);
                setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
                setTestTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [appointmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'test_type_id') {
            setShowAdditionalFields(value !== '');
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        try {
            const payload = {
                result: formData.result,
                cd4: formData.cd4 ? parseInt(formData.cd4) : null,
                note: formData.note,
                appointment_id: parseInt(appointmentId),
                test_type_id: parseInt(formData.test_type_id),
                sample_type: formData.sample_type,
                result_type: formData.result_type,
                virus_type: formData.virus_type,
                ag_ab_result: formData.ag_ab_result,
                viral_load: formData.viral_load ? parseInt(formData.viral_load) : null,
                pcr_type: formData.pcr_type,
                clinical_stage: formData.clinical_stage
            };

            await axios.put('/api/v1/appointments/diagnosis', payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            setSubmitSuccess(true);
            toast.success('Chẩn đoán đã được gửi thành công!');
            
            // Reset form data after successful submission
            setFormData(initialFormData);
            setShowAdditionalFields(false);
        } catch (err) {
            toast.error(err.response?.data?.message);
            setSubmitError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi chẩn đoán');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center text-red-500">
                        <XCircle className="h-12 w-12 mx-auto" />
                        <p className="mt-4 text-lg font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto p-6"
        >
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-xl font-semibold text-white">Chẩn đoán và điều trị</h1>
                </div>

                {/* Patient Info - This section remains visible after submission */}
                <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin bệnh nhân</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Họ tên</p>
                            <p className="font-medium">{patientInfo?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                            <p className="font-medium">{patientInfo?.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Giới tính</p>
                            <p className="font-medium">{patientInfo?.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ngày sinh</p>
                            <p className="font-medium">{patientInfo?.dob}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số điện thoại</p>
                            <p className="font-medium">{patientInfo?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Appointment Info - This section remains visible after submission */}
                <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin lịch hẹn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Ngày hẹn</p>
                            <p className="font-medium">{appointmentInfo?.date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Lý do khám</p>
                            <p className="font-medium">{appointmentInfo?.reason}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Tiền sử bệnh</p>
                            <p className="font-medium">{appointmentInfo?.medicalHistory}</p>
                        </div>
                    </div>
                </div>

                {/* Diagnosis Form */}
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin chẩn đoán</h2>

                    {submitSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                            <div className="flex items-center text-green-700">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                <p className="font-medium">Chẩn đoán đã được gửi thành công!</p>
                            </div>
                            <Button 
                                className="mt-4 bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSubmitSuccess(false)}
                            >
                                chỉnh sửa chuẩn đoán
                            </Button>
                        </div>
                    ) : submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                            <div className="flex items-center text-red-700">
                                <XCircle className="h-5 w-5 mr-2" />
                                <p className="font-medium">{submitError}</p>
                            </div>
                        </div>
                    )}

                    {!submitSuccess && (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Test Selection */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại xét nghiệm <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="test_type_id"
                                            value={formData.test_type_id}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Chọn loại xét nghiệm</option>
                                            {testTypes.map(test => (
                                                <option key={test.test_type_id} value={test.test_type_id}>
                                                    {test.test_type_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {showAdditionalFields && (
                                        <>
                                            {fieldsToShow.includes('sampleType') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Loại mẫu <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="sample_type"
                                                        value={formData.sample_type}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="WHOLE_BLOOD">Máu toàn phần</option>
                                                        <option value="SERUM">Huyết thanh</option>
                                                        <option value="PLASMA">Huyết tương</option>
                                                    </select>
                                                </div>
                                            )}

                                            {fieldsToShow.includes('clinicalStage') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giai đoạn lâm sàng <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="clinical_stage"
                                                        value={formData.clinical_stage}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="STAGE_I">Giai đoạn I</option>
                                                        <option value="STAGE_II">Giai đoạn II</option>
                                                        <option value="STAGE_III">Giai đoạn III</option>
                                                        <option value="STAGE_IV">Giai đoạn IV</option>
                                                    </select>
                                                </div>
                                            )}

                                            {fieldsToShow.includes('resultType') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Loại kết quả <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="result_type"
                                                        value={formData.result_type}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="PRELIMINARY">Sơ bộ</option>
                                                        <option value="FINAL">Cuối cùng</option>
                                                        <option value="INDETERMINATE">Không xác định</option>
                                                    </select>
                                                </div>
                                            )}

                                            {fieldsToShow.includes('result') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kết quả <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="result"
                                                        value={formData.result}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="POSITIVE">Dương tính</option>
                                                        <option value="NEGATIVE">Âm tính</option>
                                                        <option value="INCONCLUSIVE">Không xác định</option>
                                                    </select>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Middle Column - Test Type Details */}
                                <div className="lg:col-span-1">
                                    {selectedTestType && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-full">
                                            <h3 className="font-medium text-blue-800 mb-3">Thông tin xét nghiệm</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase tracking-wider">Tên xét nghiệm</p>
                                                    <p className="font-medium mt-1">{selectedTestType.test_type_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase tracking-wider">Mã xét nghiệm</p>
                                                    <p className="font-medium mt-1">{selectedTestType.test_type_description}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase tracking-wider">Đối tượng áp dụng</p>
                                                    <p className="font-medium mt-1">{selectedTestType.applicable}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase tracking-wider">Mô tả</p>
                                                    <p className="text-sm mt-1 text-gray-700">{selectedTestType.test_type_code}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Additional Fields */}
                                {showAdditionalFields && (
                                    <div className="space-y-6">
                                        {fieldsToShow.includes('virusType') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Loại virus <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="virus_type"
                                                    value={formData.virus_type}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="HIV_1">HIV-1</option>
                                                    <option value="HIV_2">HIV-2</option>
                                                </select>
                                            </div>
                                        )}

                                        {fieldsToShow.includes('agAbResult') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Kết quả Kháng nguyên/Kháng thể <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="ag_ab_result"
                                                    value={formData.ag_ab_result}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="POSITIVE">Dương tính</option>
                                                    <option value="NEGATIVE">Âm tính</option>
                                                    <option value="INCONCLUSIVE">Không xác định</option>
                                                </select>
                                            </div>
                                        )}

                                        {fieldsToShow.includes('pcrType') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Loại PCR <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="pcr_type"
                                                    value={formData.pcr_type}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="DNA">DNA</option>
                                                    <option value="RNA">RNA</option>
                                                </select>
                                            </div>
                                        )}

                                        {fieldsToShow.includes('viralLoad') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tải lượng virus (bản sao/mL)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="viral_load"
                                                    value={formData.viral_load}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Nhập tải lượng virus"
                                                    min="0"
                                                />
                                            </div>
                                        )}

                                        {fieldsToShow.includes('cd4') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số lượng CD4 (tế bào/mm³)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="cd4"
                                                    value={formData.cd4}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Nhập số lượng CD4"
                                                    min="0"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ghi chú
                                            </label>
                                            <textarea
                                                name="note"
                                                value={formData.note}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nhập ghi chú (nếu có)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {showAdditionalFields && (
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : 'Gửi chẩn đoán'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorTreatmentPage;