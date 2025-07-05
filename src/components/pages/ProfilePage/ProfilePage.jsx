import { useState, useEffect } from 'react';
import axios from "../../../setup/configAxios";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Pencil, Lock, Check, X, GraduationCap, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDegree, setIsEditingDegree] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [degreeSaveLoading, setDegreeSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [degreeSaveError, setDegreeSaveError] = useState(null);
  const [degreeSaveSuccess, setDegreeSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [doctorDegree, setDoctorDegree] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [userData, setUserData] = useState({
    account_id: '',
    last_name: '',
    first_name: '',
    email: '',
    gender: '',
    phone: '',
    avatar: null,
    address: '',
    dob: '',
    role_name: ''
  });

  const [tempData, setTempData] = useState({ ...userData });
  const [tempDegreeData, setTempDegreeData] = useState({
    name: '',
    dob: '',
    graduationDate: '',
    classification: '',
    studyMode: '',
    issueDate: '',
    schoolName: '',
    regNo: '',
    accountId: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('api/v1/accounts');
        const data = response.data;
        setUserData(data);
        setTempData(data);

        if (data.role_name === 'DOCTOR') {
          await fetchDoctorDegree(data.account_id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchDoctorDegree = async (accountId) => {
      try {
        const response = await axios.get(`api/v1/doctor-degrees/account?accountId=${accountId}`);
        const degreeData = response.data;
        setDoctorDegree(degreeData);
        if (degreeData) {
          setTempDegreeData({
            name: degreeData.name || '',
            dob: degreeData.dob || '',
            graduationDate: degreeData.graduationDate || '',
            classification: degreeData.classification || '',
            studyMode: degreeData.studyMode || '',
            issueDate: degreeData.issueDate || '',
            schoolName: degreeData.schoolName || '',
            regNo: degreeData.regNo || '',
            accountId: accountId
          });

          if (degreeData.imageUrls && degreeData.imageUrls.length > 0) {
            setImagePreview(degreeData.imageUrls[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching doctor degree:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/v1/accounts/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUserData(prev => ({
        ...prev,
        avatar: response.data.avatarUrl
      }));

      toast.success("Cập nhật ảnh đại diện thành công");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật ảnh đại diện thất bại');
      console.error('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError('Kích thước file không được vượt quá 5MB');
        return;
      }
      setSelectedImage(file);
      setImageUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadDegreeImage = async () => {
    if (!selectedImage || !doctorDegree?.id) return;

    try {
      setUploadingImage(true);
      setImageUploadError(null);

      const formData = new FormData();
      formData.append('file', selectedImage);

      await axios.post(`/api/v1/doctor-degrees/image?id=${doctorDegree.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const response = await axios.get(`api/v1/doctor-degrees/account?accountId=${userData.account_id}`);
      const updatedDegree = response.data;
      setDoctorDegree(updatedDegree);

      if (updatedDegree.imageUrls && updatedDegree.imageUrls.length > 0) {
        setImagePreview(updatedDegree.imageUrls[0]);
      }

      toast.success("Đã tải lên ảnh bằng cấp thành công");
      setSelectedImage(null);
    } catch (err) {
      setImageUploadError(err.response?.data?.message || 'Có lỗi xảy ra khi tải lên ảnh');
      console.error('Error uploading degree image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteDegreeImage = async () => {
    if (!doctorDegree?.id) return;

    try {
      setUploadingImage(true);
      setImageUploadError(null);

      await axios.delete(`/api/v1/doctor-degrees/images?id=${doctorDegree.id}`);

      const response = await axios.get(`api/v1/doctor-degrees/account?accountId=${userData.account_id}`);
      const updatedDegree = response.data;
      setDoctorDegree(updatedDegree);
      setImagePreview(null);
      setDeleteImageDialogOpen(false);

      toast.success("Đã xóa ảnh bằng cấp thành công");
    } catch (err) {
      setImageUploadError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa ảnh');
      console.error('Error deleting degree image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setSaveLoading(true);
        setSaveError(null);

        const updateData = {
          address: tempData.address || '',
          gender: tempData.gender || '',
          dob: tempData.dob || '',
          phone: tempData.phone || '',
          first_name: tempData.first_name || '',
          last_name: tempData.last_name || ''
        };

        await axios.put('api/v1/accounts', updateData);

        setUserData({ ...userData, ...updateData });
        setSaveSuccess(true);
        setIsEditing(false);

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);

      } catch (err) {
        setSaveError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      } finally {
        setSaveLoading(false);
      }
    } else {
      setTempData({ ...userData });
      setSaveError(null);
      setSaveSuccess(false);
      setIsEditing(true);
    }
  };

  const handleDegreeEditToggle = async () => {
    if (isEditingDegree) {
      try {
        setDegreeSaveLoading(true);
        setDegreeSaveError(null);

        const updateData = {
          name: tempDegreeData.name,
          dob: tempDegreeData.dob,
          graduationDate: tempDegreeData.graduationDate,
          classification: tempDegreeData.classification,
          studyMode: tempDegreeData.studyMode,
          issueDate: tempDegreeData.issueDate,
          schoolName: tempDegreeData.schoolName,
          regNo: tempDegreeData.regNo,
          accountId: tempDegreeData.accountId
        };

        await axios.put(`api/v1/doctor-degrees/update?id=${doctorDegree.id}`, updateData)

        const response = await axios.get(`api/v1/doctor-degrees/account?accountId=${userData.account_id}`);
        setDoctorDegree(response.data);
        setDegreeSaveSuccess(true);
        setIsEditingDegree(false);

        setTimeout(() => {
          setDegreeSaveSuccess(false);
        }, 3000);

      } catch (err) {
        setDegreeSaveError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin bằng cấp');
      } finally {
        setDegreeSaveLoading(false);
      }
    } else {
      if (doctorDegree) {
        setTempDegreeData({
          name: doctorDegree.name || '',
          dob: doctorDegree.dob || '',
          graduationDate: doctorDegree.graduationDate || '',
          classification: doctorDegree.classification || '',
          studyMode: doctorDegree.studyMode || '',
          issueDate: doctorDegree.issueDate || '',
          schoolName: doctorDegree.schoolName || '',
          regNo: doctorDegree.regNo || '',
          accountId: userData.account_id
        });
      }
      setDegreeSaveError(null);
      setDegreeSaveSuccess(false);
      setIsEditingDegree(true);
    }
  };

  const handleDeleteDegree = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await axios.delete(`/api/v1/doctor-degrees/delete?id=${doctorDegree.id}`);

      setDoctorDegree(null);
      setTempDegreeData({
        name: '',
        dob: '',
        graduationDate: '',
        classification: '',
        studyMode: '',
        issueDate: '',
        schoolName: '',
        regNo: '',
        accountId: userData.account_id
      });
      setImagePreview(null);

      setDeleteDialogOpen(false);
      toast.success("Đã xóa thông tin bằng cấp thành công");
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa thông tin bằng cấp');
      console.error('Error deleting degree:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempData({ ...userData });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCancelDegreeEdit = () => {
    setIsEditingDegree(false);
    if (doctorDegree) {
      setTempDegreeData({
        name: doctorDegree.name || '',
        dob: doctorDegree.dob || '',
        graduationDate: doctorDegree.graduationDate || '',
        classification: doctorDegree.classification || '',
        studyMode: doctorDegree.studyMode || '',
        issueDate: doctorDegree.issueDate || '',
        schoolName: doctorDegree.schoolName || '',
        regNo: doctorDegree.regNo || '',
        accountId: userData.account_id
      });
    }
    setDegreeSaveError(null);
    setDegreeSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    setTempData({
      ...tempData,
      [e.target.name]: e.target.value
    });
    if (saveError) setSaveError(null);
  };

  const handleDegreeInputChange = (e) => {
    setTempDegreeData({
      ...tempDegreeData,
      [e.target.name]: e.target.value
    });
    if (degreeSaveError) setDegreeSaveError(null);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (passwordError) setPasswordError(null);
    if (passwordSuccess) setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);

      await axios.post(`api/v1/accounts/change-password`, null, {
        params: {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      });

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '' });

      setTimeout(() => {
        setPasswordSuccess(false);
        setIsChangingPassword(false);
      }, 2000);

    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getClassificationBadge = (classification) => {
    switch (classification) {
      case 'EXCELLENT':
        return <Badge variant="success">Xuất sắc</Badge>;
      case 'GOOD':
        return <Badge variant="default">Giỏi</Badge>;
      case 'AVERAGE':
        return <Badge variant="secondary">Khá</Badge>;
      case 'POOR':
        return <Badge variant="destructive">Trung bình</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStudyModeText = (studyMode) => {
    switch (studyMode) {
      case 'FULL_TIME':
        return 'Toàn thời gian';
      case 'PART_TIME':
        return 'Bán thời gian';
      case 'DISTANCE':
        return 'Từ xa';
      default:
        return studyMode;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 text-red-600 rounded-lg">
        Error loading profile: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 text-green-600 p-4 rounded-lg"
        >
          Cập nhật thông tin thành công!
        </motion.div>
      )}

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg"
        >
          {saveError}
        </motion.div>
      )}

      {degreeSaveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 text-green-600 p-4 rounded-lg"
        >
          Cập nhật thông tin bằng cấp thành công!
        </motion.div>
      )}

      {degreeSaveError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg"
        >
          {degreeSaveError}
        </motion.div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này sẽ xóa vĩnh viễn thông tin bằng cấp của bạn và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDegree}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
          {deleteError && (
            <div className="mt-4 text-sm text-red-600">
              {deleteError}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteImageDialogOpen} onOpenChange={setDeleteImageDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa ảnh bằng cấp?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này sẽ xóa vĩnh viễn ảnh bằng cấp của bạn và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={uploadingImage}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDegreeImage}
              disabled={uploadingImage}
              className="bg-red-600 hover:bg-red-700"
            >
              {uploadingImage ? 'Đang xóa...' : 'Xác nhận xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
          {imageUploadError && (
            <div className="mt-4 text-sm text-red-600">
              {imageUploadError}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/3 flex flex-col items-center"
        >
          <div className="relative group">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                {userData.avatar ? (
                  <AvatarImage src={userData.avatar} alt={`${userData.first_name} ${userData.last_name}`} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl font-semibold">
                    {userData.first_name?.[0]}{userData.last_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md">
                {uploadingAvatar ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Kích thước file không được vượt quá 5MB');
                    return;
                  }
                  handleAvatarUpload(file);
                }
              }}
              disabled={uploadingAvatar}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 w-full space-y-4"
          >
            <Button
              variant="outline"
              className="w-full flex gap-2"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              disabled={isEditing || isEditingDegree}
            >
              <Lock className="h-4 w-4" />
              Đổi mật khẩu
            </Button>

            {isChangingPassword && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50 p-4 rounded-lg"
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                      Đổi mật khẩu thành công!
                    </div>
                  )}

                  <div>
                    <Label>Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label>Mật khẩu mới</Label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '' });
                        setPasswordError(null);
                        setPasswordSuccess(false);
                      }}
                      disabled={passwordLoading}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <div className="w-full md:w-2/3 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  disabled={saveLoading || isEditingDegree}
                >
                  <Pencil className="h-4 w-4" />
                  Chỉnh sửa
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditToggle}
                    disabled={saveLoading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    {saveLoading ? 'Đang lưu...' : 'Lưu'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelEdit}
                    disabled={saveLoading}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </motion.button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Họ</Label>
                {isEditing ? (
                  <Input
                    name="last_name"
                    value={tempData.last_name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{userData.last_name || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <Label>Tên</Label>
                {isEditing ? (
                  <Input
                    name="first_name"
                    value={tempData.first_name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{userData.first_name || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <p className="mt-1 text-gray-700">{userData.email}</p>
              </div>

              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={tempData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{userData.phone || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <Label>Giới tính</Label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={tempData.gender || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-700">
                    {userData.gender === 'MALE' ? 'Nam' :
                      userData.gender === 'FEMALE' ? 'Nữ' :
                        userData.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                  </p>
                )}
              </div>

              <div>
                <Label>Địa chỉ</Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={tempData.address}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{userData.address || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <Label>Ngày sinh</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dob"
                    value={tempData.dob || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-700">
                    {userData.dob ? formatDate(userData.dob) : 'Chưa cập nhật'}
                  </p>
                )}
              </div>

              <div>
                <Label>Vai trò</Label>
                <p className="mt-1 text-gray-700">
                  {userData.role_name === 'CUSTOMER' ? 'Bệnh nhân' :
                    userData.role_name === 'DOCTOR' ? 'Bác sĩ' :
                      userData.role_name === 'ADMIN' ? 'Admin' : userData.role_name}
                </p>
              </div>
            </div>
          </motion.div>

          {userData.role_name === 'DOCTOR' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Thông tin bằng cấp</h2>
                </div>

                {doctorDegree && !isEditingDegree ? (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDegreeEditToggle}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      disabled={degreeSaveLoading || isEditing}
                    >
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteDialogOpen(true)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      disabled={isEditing}
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </motion.button>
                  </div>
                ) : isEditingDegree ? (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDegreeEditToggle}
                      disabled={degreeSaveLoading}
                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      {degreeSaveLoading ? 'Đang lưu...' : 'Lưu'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancelDegreeEdit}
                      disabled={degreeSaveLoading}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </motion.button>
                  </div>
                ) : null}
              </div>

              {doctorDegree ? (
                <div>
                  <div className="mb-6">
                    <Label className="block mb-2">Ảnh bằng cấp</Label>
                    <div className="flex items-start gap-4">
                      <div className="relative w-48 h-32 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Degree"
                              className="object-contain w-full h-full"
                            />
                            <button
                              onClick={() => setDeleteImageDialogOpen(true)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              title="Xóa ảnh"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon className="h-8 w-8 mb-1" />
                            <span className="text-sm">Chưa có ảnh</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <Label
                            htmlFor="degreeImage"
                            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4" />
                            Chọn ảnh
                          </Label>
                          <Input
                            id="degreeImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            onClick={uploadDegreeImage}
                            disabled={!selectedImage || uploadingImage}
                            className="flex items-center gap-2"
                          >
                            {uploadingImage ? 'Đang tải lên...' : 'Tải lên'}
                          </Button>
                        </div>
                        {selectedImage && (
                          <p className="text-sm text-gray-600">{selectedImage.name}</p>
                        )}
                        {imageUploadError && (
                          <p className="text-sm text-red-600 mt-1">{imageUploadError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Chỉ chấp nhận file ảnh (JPEG, PNG). Kích thước tối đa 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Họ tên</Label>
                        {isEditingDegree ? (
                          <Input
                            name="name"
                            value={tempDegreeData.name}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 font-medium">{doctorDegree.name || 'Chưa cập nhật'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ngày sinh</Label>
                        {isEditingDegree ? (
                          <Input
                            type="date"
                            name="dob"
                            value={formatDateForInput(tempDegreeData.dob)}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1">{formatDate(doctorDegree.dob)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trường đào tạo</Label>
                        {isEditingDegree ? (
                          <Input
                            name="schoolName"
                            value={tempDegreeData.schoolName}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 font-medium">{doctorDegree.schoolName}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Số hiệu bằng</Label>
                        {isEditingDegree ? (
                          <Input
                            name="regNo"
                            value={tempDegreeData.regNo}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 font-mono">{doctorDegree.regNo}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Ngày tốt nghiệp</Label>
                        {isEditingDegree ? (
                          <Input
                            type="date"
                            name="graduationDate"
                            value={formatDateForInput(tempDegreeData.graduationDate)}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1">{formatDate(doctorDegree.graduationDate)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ngày cấp bằng</Label>
                        {isEditingDegree ? (
                          <Input
                            type="date"
                            name="issueDate"
                            value={formatDateForInput(tempDegreeData.issueDate)}
                            onChange={handleDegreeInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1">{formatDate(doctorDegree.issueDate)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Xếp loại</Label>
                        {isEditingDegree ? (
                          <select
                            name="classification"
                            value={tempDegreeData.classification || ''}
                            onChange={handleDegreeInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                          >
                            <option value="">Chọn xếp loại</option>
                            <option value="EXCELLENT">Xuất sắc</option>
                            <option value="GOOD">Giỏi</option>
                            <option value="AVERAGE">Khá</option>
                            <option value="POOR">Trung bình</option>
                          </select>
                        ) : (
                          <div className="mt-1">
                            {getClassificationBadge(doctorDegree.classification)}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Hình thức đào tạo</Label>
                        {isEditingDegree ? (
                          <select
                            name="studyMode"
                            value={tempDegreeData.studyMode || ''}
                            onChange={handleDegreeInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                          >
                            <option value="">Chọn hình thức</option>
                            <option value="FULL_TIME">Toàn thời gian</option>
                            <option value="PART_TIME">Bán thời gian</option>
                          </select>
                        ) : (
                          <p className="mt-1">{getStudyModeText(doctorDegree.studyMode)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chưa có thông tin bằng cấp</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;