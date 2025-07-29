import { useState, useEffect } from 'react';
import axios from '../../../setup/configAxios'
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "../../ui/button";
import { Loader2, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
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
    const [showAdditionalFields, setShowAdditionalFields] = useState(true);
    const [showEditDiagnosisModal, setShowEditDiagnosisModal] = useState(false);


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

    //Treatment data

    const initialTreatmentForm = {
        gender: 'MALE',
        dob: '',
        applicable: '',
        prognosis: '',
        prevention: '',
        method: '',
        pregnant: '',
        first_name: '',
        last_name: '',
        medical_history: '',
        dosage_instruction: '',
        next_follow_up: '',
        treatment_regimen_id: ''
    };
    const [treatmentForm, setTreatmentForm] = useState(initialTreatmentForm);

    const [treatmentRegimens, setTreatmentRegimens] = useState([]);
    const [treatmentSubmitSuccess, setTreatmentSubmitSuccess] = useState(false);
    const [treatmentSubmitError, setTreatmentSubmitError] = useState(null);
    const [canShowTreatment, setCanShowTreatment] = useState(false);
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [dosageData, setDosageData] = useState([]);



    // Get the selected test type details
    const selectedTestType = formData.test_type_id
        ? testTypes.find(test => test.test_type_id === parseInt(formData.test_type_id))
        : null;

    //Get the selected treatment regiment details
    const selectedRegimen = treatmentForm.treatment_regimen_id
        ? treatmentRegimens.find(r => r.treatment_regimen_id === parseInt(treatmentForm.treatment_regimen_id))
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

    // Determine which ARV to show in treatment
    const getFieldsToShowTreatment = () => {
        if (!selectedRegimen) return [];

        const name = selectedRegimen.name?.toLowerCase();

        if (name.includes("ưu tiên")) {
            return ["method", "prognosis", "prevention", "applicable", "dosage_instruction", "next_follow_up"];
        } else if (name.includes("thay thế")) {
            return ["method", "prognosis", "prevention", "applicable", "dosage_instruction", "next_follow_up"];
        } else if (name.includes("đặc biệt")) {
            return ["method", "prognosis", "prevention", "applicable", "dosage_instruction", "next_follow_up"];
        }

        return [];
    };

    const fieldsToShowTreatment = getFieldsToShowTreatment();

    // Parse dosage instruction string to dosage data
    const parseDosageInstruction = (instruction) => {
        if (!instruction) return [];

        const drugs = [];
        const lines = instruction.split('. \n').filter(line => line.trim());

        lines.forEach(line => {
            const drugMatch = line.match(/^(.+?)\s*\((.+?)\):\s*(.+?)(?:\s*-\s*(.+))?$/);
            if (drugMatch) {
                const [, drugName, shortName, dosageStr, note] = drugMatch;

                const dosages = { morning: '', noon: '', afternoon: '', evening: '' };
                const dosageParts = dosageStr.split('/');

                dosageParts.forEach(part => {
                    const trimmed = part.trim();
                    if (trimmed.startsWith('Sáng ')) {
                        dosages.morning = trimmed.replace('Sáng ', '').replace(' viên', '');
                    } else if (trimmed.startsWith('Trưa ')) {
                        dosages.noon = trimmed.replace('Trưa ', '').replace(' viên', '');
                    } else if (trimmed.startsWith('Chiều ')) {
                        dosages.afternoon = trimmed.replace('Chiều ', '').replace(' viên', '');
                    } else if (trimmed.startsWith('Tối ')) {
                        dosages.evening = trimmed.replace('Tối ', '').replace(' viên', '');
                    }
                });

                drugs.push({
                    drug_name: drugName.trim(),
                    short_name: shortName.trim(),
                    ...dosages,
                    note: note ? note.trim() : ''
                });
            }
        });

        return drugs;
    };

    // Convert dosage data to instruction string
    const formatDosageInstruction = (dosageData) => {
        return dosageData.map((drug, index) => {
            const dosageParts = [];
            if (drug.morning) dosageParts.push(`Sáng ${drug.morning} viên`);
            if (drug.noon) dosageParts.push(`Trưa ${drug.noon} viên`);
            if (drug.afternoon) dosageParts.push(`Chiều ${drug.afternoon} viên`);
            if (drug.evening) dosageParts.push(`Tối ${drug.evening} viên`);

            let result = `${drug.drug_name}(${drug.short_name}): ${dosageParts.join('/')}`;
            if (drug.note) {
                result += ` - ${drug.note}`;
            }
            return result;
        }).join('. \n') + (dosageData.length > 0 ? '. \n' : '');
    };

    // Initialize dosage data when method changes
    const initializeDosageData = () => {
        if (!selectedRegimen || !treatmentForm.method) return;

        const selectedMethod = selectedRegimen.treatment_regimen_drugs?.find(
            drugGroup => drugGroup.method === parseInt(treatmentForm.method)
        );

        if (selectedMethod?.drugs) {
            const newDosageData = selectedMethod.drugs.map(drug => ({
                drug_name: drug.drug_name,
                short_name: drug.short_name,
                morning: '',
                noon: '',
                afternoon: '',
                evening: '',
                note: ''
            }));
            setDosageData(newDosageData);

            setTreatmentForm(prev => ({
                ...prev,
                dosage_instruction: ''
            }));
        }
    };

    // Handle opening dosage modal
    const handleOpenDosageModal = () => {
        if (treatmentForm.dosage_instruction) {
            // Parse existing instruction
            const parsed = parseDosageInstruction(treatmentForm.dosage_instruction);
            setDosageData(parsed);
        } else {
            // Initialize with current drugs
            initializeDosageData();
        }
        setShowDosageModal(true);
    };

    // Handle dosage data change
    const handleDosageChange = (index, field, value) => {
        setDosageData(prev => prev.map((drug, i) =>
            i === index ? { ...drug, [field]: value } : drug
        ));
    };

    // Handle saving dosage
    const handleSaveDosage = () => {
        if (dosageData.length === 0) {
            toast.error('Không có thuốc nào để kê đơn. Vui lòng chọn phác đồ và phương pháp điều trị trước.');
            return;
        }

        const errors = [];

        // Hàm kiểm tra xem giá trị có phải là số hợp lệ không
        const isValidNumber = (value) => {
            if (!value || value.trim() === '' || value.trim() === '0') {
                return true; // Cho phép trống hoặc 0
            }

            // Kiểm tra xem có phải là số không (bao gồm số thập phân)
            const numValue = parseFloat(value.trim());
            return !isNaN(numValue) && isFinite(numValue) && numValue > 0;
        };

        // Hàm kiểm tra xem có chứa chữ không
        const containsLetters = (value) => {
            if (!value || value.trim() === '') return false;
            return /[a-zA-ZÀ-ỹ]/.test(value.trim());
        };

        dosageData.forEach((drug, index) => {
            const { drug_name, short_name, morning, noon, afternoon, evening, note } = drug;

            // Kiểm tra từng trường lượng thuốc có chứa chữ không
            const dosageFields = [
                { name: 'sáng', value: morning },
                { name: 'trưa', value: noon },
                { name: 'chiều', value: afternoon },
                { name: 'tối', value: evening }
            ];

            // Kiểm tra chữ trong các trường lượng thuốc
            dosageFields.forEach(field => {
                if (containsLetters(field.value)) {
                    errors.push(`Thuốc "${drug_name} (${short_name})" - Lượng thuốc ${field.name} không được chứa chữ cái. Vui lòng nhập số.`);
                } else if (field.value && field.value.trim() !== '' && field.value.trim() !== '0' && !isValidNumber(field.value)) {
                    errors.push(`Thuốc "${drug_name} (${short_name})" - Lượng thuốc ${field.name} không hợp lệ. Vui lòng nhập số dương.`);
                }
            });

            // Nếu đã có lỗi về định dạng số, không cần kiểm tra tiếp
            if (errors.length > 0) return;

            const isEmpty =
                (!morning || morning.trim() === '0') &&
                (!noon || noon.trim() === '0') &&
                (!afternoon || afternoon.trim() === '0') &&
                (!evening || evening.trim() === '0');

            // Trường hợp tất cả đều trống và không có ghi chú
            if (isEmpty && !note.trim()) {
                errors.push(`Thuốc "${drug_name} (${short_name})" chưa nhập lượng thuốc uống.`);
            }

            // Trường hợp chỉ có ghi chú mà không nhập liều
            if (note.trim() && isEmpty) {
                errors.push(`Thuốc "${drug_name} (${short_name})" chưa nhập lượng thuốc uống.`);
            }
        });

        if (errors.length > 0) {
            toast.error(errors[0]); // Hiển thị lỗi đầu tiên
            return;
        }

        const instruction = formatDosageInstruction(dosageData);
        setTreatmentForm(prev => ({
            ...prev,
            dosage_instruction: instruction
        }));
        setShowDosageModal(false);
    };


    // Fetch test types and patient/appointment info
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch test types
                const testTypesResponse = await axios.get('/api/v1/test-types/all');
                if (!testTypesResponse.data || !Array.isArray(testTypesResponse.data)) {
                    toast.error('Invalid test types data format');
                }
                const activeTestTypes = testTypesResponse.data.filter(
                    test => test.is_active === 'ACTIVE'
                );
                setTestTypes(activeTestTypes);

                // Fetch treatment regimens
                const treatmentRegimensResponse = await axios.get(
                    '/api/v1/treatment-regimens/list?pageNo=0&pageSize=10&sortBy=id&sortDir=asc'
                );
                const treatmentData = treatmentRegimensResponse?.data?.content || [];
                setTreatmentRegimens(treatmentData);

                // Fetch appointment info
                const appointmentResponse = await axios.get(`/api/v1/appointments?appointmentId=${appointmentId}`);
                if (!appointmentResponse.data) {
                    toast.error('Invalid appointment data');
                }

                const appointmentData = appointmentResponse.data;
                setAppointmentInfo({
                    date: new Date(appointmentData.start_time).toLocaleDateString(),
                    reason: appointmentData.chief_complaint || 'Khám tổng quát',
                    medicalHistory: appointmentData.medical_history || 'Không có',
                    isPregnant: appointmentData.is_pregnant || 'False'
                });

                setPatientInfo({
                    name: appointmentData.is_anonymous ? 'Bệnh nhân ẩn danh' : appointmentData.full_name,
                    id: appointmentData.customer?.customer_id || 'N/A',
                    gender: appointmentData.gender === 'MALE' ? 'Nam' : 'Nữ',
                    dob: new Date(appointmentData.dob).toLocaleDateString(),
                    phone: appointmentData.customer?.phone || 'N/A'
                });

            } catch (err) {
                console.error('Error fetching data:', err);

                toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                setError(err.message || 'Không thể tải dữ liệu.');
                setTestTypes([]);
            } finally {

                setLoading(false);
            }
        };

        fetchData();


    }, [appointmentId]);

    // Initialize dosage data when method changes
    useEffect(() => {
        if (treatmentForm.method && selectedRegimen) {
            initializeDosageData();
        }
    }, [treatmentForm.method, selectedRegimen]);

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

        // Validate diagnosis fields
        if (!formData.test_type_id) {
            toast.error('Vui lòng chọn loại xét nghiệm.');
            setSubmitting(false);
            return;
        }

        const requiredFields = getFieldsToShow();
        if (requiredFields.includes('cd4') && !formData.cd4) {
            toast.error('Vui lòng nhập chỉ số CD4.');
            setSubmitting(false);
            return;
        }
        if (requiredFields.includes('viralLoad') && !formData.viral_load) {
            toast.error('Vui lòng nhập tải lượng virus.');
            setSubmitting(false);
            return;
        }
        if (requiredFields.includes('result') && !formData.result) {
            toast.error('Vui lòng chọn kết quả.');
            setSubmitting(false);
            return;
        }

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
            });

            setSubmitSuccess(true);
            setCanShowTreatment(true);
            toast.success('Chẩn đoán đã được gửi thành công!');
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

    //handle treatment value
    const handleTreatmentChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTreatmentForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    const handleTreatmentRegimenChange = (e) => {
        const value = e.target.value;

        if (value === '') {
            // Reset form
            setTreatmentForm(prev => ({
                ...prev,
                treatment_regimen_id: '',
                method: '',
                prognosis: '',
                prevention: '',
                applicable: '',
                pregnant: '',
                dosage_instruction: '',
                next_follow_up: ''
            }));
            return;
        }

        const selectedRegimenId = parseInt(value);
        const selectedRegimen = treatmentRegimens.find(r => r.treatment_regimen_id === selectedRegimenId);
        const defaultMethod = selectedRegimen?.treatment_regimen_drugs?.[0]?.method || '';

        setTreatmentForm(prev => ({
            ...prev,
            treatment_regimen_id: selectedRegimenId,
            method: defaultMethod,
            prognosis: '',
            prevention: '',
            applicable: '',
            pregnant: '',
            dosage_instruction: '',
            next_follow_up: ''
        }));
    };

    // handle treatment submit
    const handleSubmitTreatment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTreatmentSubmitError(null);

        // Validate treatment fields
        if (!treatmentForm.treatment_regimen_id) {
            toast.error("Vui lòng chọn phác đồ điều trị.");
            setSubmitting(false);
            return;
        }
        if (!treatmentForm.method) {
            toast.error("Vui lòng chọn phương pháp điều trị.");
            setSubmitting(false);
            return;
        }
        if (!treatmentForm.applicable) {
            toast.error("Vui lòng chọn đối tượng áp dụng.");
            setSubmitting(false);
            return;
        }
        if (!treatmentForm.next_follow_up) {
            toast.error("Vui lòng chọn lịch tái khám.");
            setSubmitting(false);
            return;
        }
        const followUpDate = new Date(treatmentForm.next_follow_up);
        const now = new Date();
        if (followUpDate <= now) {
            toast.error("Lịch tái khám phải là thời gian trong tương lai.");
            setSubmitting(false);
            return;
        }

        try {

            // Tách họ và tên từ patientInfo.name
            const fullName = patientInfo?.name || '';
            const nameParts = fullName.trim().split(/\s+/);

            let firstName = '';
            let lastName = '';

            if (nameParts.length === 1) {
                // Chỉ có một từ, coi như là tên
                firstName = nameParts[0];
                lastName = '';
            } else if (nameParts.length >= 2) {
                // Có nhiều từ, lấy từ cuối là tên, phần còn lại là họ
                firstName = nameParts[nameParts.length - 1];
                lastName = nameParts.slice(0, -1).join(' ');
            }

            // Nếu bệnh nhân ẩn danh, sử dụng giá trị mặc định
            if (patientInfo?.name === 'Bệnh nhân ẩn danh') {
                firstName = 'Ẩn danh';
                lastName = 'Bệnh nhân';
            }

            const payload = {
                appointmentId: parseInt(appointmentId),
                gender: patientInfo?.gender === 'Nam' ? 'MALE' : 'FEMALE',
                dob: new Date().toISOString().split('T')[0],
                applicable: treatmentForm.applicable,
                prognosis: treatmentForm.prognosis,
                prevention: treatmentForm.prevention,
                method: parseInt(treatmentForm.method),
                pregnant: appointmentInfo?.isPregnant,
                first_name: firstName,
                last_name: lastName,
                dosage_instruction: treatmentForm.dosage_instruction,
                next_follow_up: treatmentForm.next_follow_up,
                treatment_regimen_id: parseInt(treatmentForm.treatment_regimen_id)
            };

            await axios.put('/api/v1/appointments/treatment', payload, {
            });

            toast.success('Đã gửi phác đồ điều trị!');
            setTreatmentSubmitSuccess(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi gửi phác đồ');
            setTreatmentSubmitError(err.response?.data?.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditDiagnosisConfirm = () => {
        const hasTreatmentData =
            treatmentForm.treatment_regimen_id !== '' ||
            treatmentForm.method !== '' ||
            treatmentForm.prognosis !== '' ||
            treatmentForm.prevention !== '' ||
            treatmentForm.applicable !== '' ||
            treatmentForm.dosage_instruction !== '' ||
            treatmentForm.pregnant !== '' ||
            treatmentForm.next_follow_up !== '';

        if (hasTreatmentData) {
            setShowEditDiagnosisModal(true); // sẽ show dialog confirm
        } else {
            setSubmitSuccess(false); // mở lại form chẩn đoán 
            setCanShowTreatment(false);
            setTreatmentSubmitSuccess(false);
        }
    };

    const handleEditDiagnosisYes = () => {
        setShowEditDiagnosisModal(false);
        setSubmitSuccess(false);
        setCanShowTreatment(false);
        setTreatmentSubmitSuccess(false);
        setTreatmentForm(initialTreatmentForm); // reset treatment form
        setDosageData([]);
        toast.info("Phác đồ điều trị đã được hủy do có thay đổi trong chẩn đoán.");
    };


    const handleEditDiagnosisNo = () => {
        setShowEditDiagnosisModal(false);
    };



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
                                onClick={handleEditDiagnosisConfirm}
                            >
                                Chỉnh sửa chuẩn đoán
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

                {/* Treatment Form */}
                {canShowTreatment && (
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Chọn phác đồ điều trị</h2>

                        {treatmentSubmitSuccess ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                                <div className="flex items-center text-green-700">
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    <p className="font-medium">Phác đồ đã được gửi thành công!</p>
                                </div>
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => setTreatmentSubmitSuccess(false)}>
                                    Chỉnh sửa bản điều trị
                                </Button>
                            </div>
                        ) : treatmentSubmitError && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                <div className="flex items-center text-red-700">
                                    <XCircle className="h-5 w-5 mr-2" />
                                    <p className="font-medium">{treatmentSubmitError}</p>
                                </div>
                            </div>
                        )}

                        {!treatmentSubmitSuccess && (
                            <form onSubmit={handleSubmitTreatment}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column: chọn phác đồ */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phác đồ điều trị</label>
                                            <select
                                                name="treatment_regimen_id"
                                                value={treatmentForm.treatment_regimen_id}
                                                onChange={handleTreatmentRegimenChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Chọn phác đồ</option>
                                                {treatmentRegimens.map(regimen => (
                                                    <option key={regimen.treatment_regimen_id} value={regimen.treatment_regimen_id}>
                                                        {regimen.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Dosage instruction field */}
                                        {treatmentForm.treatment_regimen_id && fieldsToShowTreatment.includes("dosage_instruction") && (
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn thuốc</label>
                                                <textarea
                                                    name="dosage_instruction"
                                                    value={treatmentForm.dosage_instruction}
                                                    onChange={handleTreatmentChange}
                                                    rows={6}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                                                    placeholder="Nhập ghi chú đơn thuốc (nếu có)"
                                                />
                                                {treatmentForm.method && (
                                                    <button
                                                        type="button"
                                                        onClick={handleOpenDosageModal}
                                                        className="absolute bottom-2 right-2 flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        <HelpCircle className="h-4 w-4 mr-1" />
                                                        Hỗ trợ ghi chú
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle Column: thông tin phác đồ */}
                                    <div className="lg:col-span-1">
                                        {treatmentForm.treatment_regimen_id && (
                                            (() => {
                                                const selected = treatmentRegimens.find(
                                                    r => r.treatment_regimen_id === parseInt(treatmentForm.treatment_regimen_id)
                                                );
                                                if (!selected) return null;

                                                return (
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-full">
                                                        <h3 className="font-medium text-blue-800 mb-3">Thông tin phác đồ</h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-xs text-blue-600 uppercase tracking-wider">Tên phác đồ</p>
                                                                <p className="font-medium mt-1">{selectedRegimen.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-blue-600 uppercase tracking-wider">Đối tượng áp dụng</p>
                                                                <p className="font-medium mt-1">{selectedRegimen.applicable}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-blue-600 uppercase tracking-wider">Tuyến điều trị</p>
                                                                <p className="font-medium mt-1">
                                                                    {selectedRegimen.lineLevel === 'FIRST_LINE' ? 'Tuyến đầu'
                                                                        : selectedRegimen.lineLevel === 'SECOND_LINE' ? 'Tuyến hai'
                                                                            : selectedRegimen.lineLevel}
                                                                </p>
                                                            </div>
                                                            {selectedRegimen.note && (
                                                                <div>
                                                                    <p className="text-xs text-blue-600 uppercase tracking-wider">Lưu ý</p>
                                                                    <p className="text-sm mt-1 text-gray-700">{selectedRegimen.note}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>

                                    {/* Right Column: fields còn lại */}
                                    {treatmentForm.treatment_regimen_id && (
                                        <div className="space-y-6">
                                            {fieldsToShowTreatment.includes("method") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp điều trị <span className="text-red-500">*</span></label>
                                                    <select
                                                        name="method"
                                                        value={treatmentForm.method}
                                                        onChange={handleTreatmentChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    >
                                                        <option value="">Chọn phương pháp</option>
                                                        {(selectedRegimen?.treatment_regimen_drugs || []).map(m => (
                                                            <option key={m.method} value={m.method}>Phương pháp {m.method}</option>
                                                        ))}
                                                    </select>

                                                    {treatmentForm.method && (
                                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                                                            <h3 className="font-medium text-blue-800 mb-3">Danh sách thuốc</h3>
                                                            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                                                {(
                                                                    selectedRegimen?.treatment_regimen_drugs?.find(drugGroup => drugGroup.method === parseInt(treatmentForm.method))?.drugs || []
                                                                ).map(drug => (
                                                                    <li key={drug.drug_id}>{drug.drug_name} ({drug.short_name}) - {drug.drug_type}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {fieldsToShowTreatment.includes("prognosis") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiên lượng <span className="text-red-500">*</span></label>
                                                    <input
                                                        name="prognosis"
                                                        value={treatmentForm.prognosis}
                                                        onChange={handleTreatmentChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            )}

                                            {fieldsToShowTreatment.includes("prevention") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ngừa <span className="text-red-500">*</span></label>
                                                    <input
                                                        name="prevention"
                                                        value={treatmentForm.prevention}
                                                        onChange={handleTreatmentChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            )}

                                            {fieldsToShowTreatment.includes("applicable") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng áp dụng <span className="text-red-500">*</span></label>
                                                    <select
                                                        name="applicable"
                                                        value={treatmentForm.applicable}
                                                        onChange={handleTreatmentChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    >
                                                        <option value="">Chọn đối tượng</option>
                                                        <option value="Infant">Em bé</option>
                                                        <option value="Adolescents">Trẻ em</option>
                                                        <option value="Adults">Người lớn</option>
                                                        <option value="PregnantWomen">Phụ nữ có thai</option>
                                                    </select>
                                                </div>
                                            )}

                                            {fieldsToShowTreatment.includes("pregnant") && patientInfo?.gender === 'Nữ' && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="pregnant"
                                                        checked={treatmentForm.pregnant}
                                                        onChange={handleTreatmentChange}
                                                        className="mr-2"
                                                    />
                                                    <label className="text-sm text-gray-700">Mang thai</label>
                                                </div>
                                            )}

                                            {fieldsToShowTreatment.includes("next_follow_up") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lịch tái khám tiếp theo <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="date"
                                                        name="next_follow_up"
                                                        value={treatmentForm.next_follow_up}
                                                        onChange={handleTreatmentChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {treatmentForm.treatment_regimen_id && (
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
                                            ) : 'Gửi phác đồ'}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                )}

                {/* Dosage Modal */}
                {showDosageModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">Hỗ trợ cách dùng</h2>
                                <button
                                    onClick={() => setShowDosageModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {dosageData.map((drug, index) => (
                                    <div key={index} className="border-b pb-6 last:border-b-0">
                                        <h3 className="font-semibold text-gray-800 mb-4">
                                            {index + 1}. {drug.drug_name} ({drug.short_name})
                                        </h3>

                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Sáng:</label>
                                                <input
                                                    type="text"
                                                    value={drug.morning}
                                                    onChange={(e) => handleDosageChange(index, 'morning', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Trưa:</label>
                                                <input
                                                    type="text"
                                                    value={drug.noon}
                                                    onChange={(e) => handleDosageChange(index, 'noon', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Chiều:</label>
                                                <input
                                                    type="text"
                                                    value={drug.afternoon}
                                                    onChange={(e) => handleDosageChange(index, 'afternoon', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Tối:</label>
                                                <input
                                                    type="text"
                                                    value={drug.evening}
                                                    onChange={(e) => handleDosageChange(index, 'evening', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Ghi chú:</label>
                                            <input
                                                type="text"
                                                value={drug.note}
                                                onChange={(e) => handleDosageChange(index, 'note', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                placeholder="Nhập ghi chú (ví dụ: Sau ăn, trước ăn...)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={() => setShowDosageModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={handleSaveDosage}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit confirmation */}
                {showEditDiagnosisModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">Xác nhận chỉnh sửa</h2>
                            <p className="mb-6 text-gray-700">
                                Việc chỉnh sửa chẩn đoán sẽ hủy bỏ phác đồ điều trị đã chọn trước đó. Bạn có chắc chắn muốn tiếp tục?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={handleEditDiagnosisNo}
                                >
                                    Không
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={handleEditDiagnosisYes}
                                >
                                    Có
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div>
        </motion.div>
    );
};

export default DoctorTreatmentPage;