import React, { useState } from 'react';
import { Calendar, Clock, User, UserCheck, Shield, Phone, Mail, Bell, CheckCircle } from 'lucide-react';

const BookingInterface = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    smsReminder: true,
    emailReminder: true,
    reminderTime: '24h'
  });

  const doctors = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn An',
      specialty: 'HIV/AIDS Specialist',
      experience: '15 years',
      rating: 4.9,
      availability: 'Available today',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Dr. Trần Thị Bình',
      specialty: 'Infectious Disease Specialist',
      experience: '12 years',
      rating: 4.8,
      availability: 'Available tomorrow',
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'Dr. Lê Hoàng Cường',
      specialty: 'Internal Medicine & HIV Care',
      experience: '18 years',
      rating: 4.9,
      availability: 'Available this week',
      image: '/api/placeholder/80/80'
    }
  ];

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Appointment',
    'Test Results Review',
    'Treatment Adjustment',
    'General Support'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Step 1: Anonymity Options
  const AnonymityStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Options</h2>
        <p className="text-gray-600">Choose how you'd like to book your appointment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            !isAnonymous ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setIsAnonymous(false)}
        >
          <User className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Regular Booking</h3>
          <p className="text-sm text-gray-600">Book with your personal information for better care coordination</p>
        </div>

        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            isAnonymous ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setIsAnonymous(true)}
        >
          <Shield className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Anonymous Booking</h3>
          <p className="text-sm text-gray-600">Book anonymously for complete privacy and confidentiality</p>
        </div>
      </div>
    </div>
  );

  // Step 2: Patient Information (conditional)
  const PatientInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <UserCheck className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAnonymous ? 'Anonymous Booking' : 'Patient Information'}
        </h2>
        <p className="text-gray-600">
          {isAnonymous 
            ? 'You can proceed without providing personal details' 
            : 'Please provide your information for better care'}
        </p>
      </div>

      {!isAnonymous && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex space-x-4">
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  {gender}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAnonymous && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Shield className="mx-auto h-12 w-12 text-green-600 mb-3" />
          <h3 className="font-semibold text-green-900 mb-2">Anonymous Booking Active</h3>
          <p className="text-green-800">Your privacy is protected. No personal information is required.</p>
        </div>
      )}
    </div>
  );

  // Step 3: Doctor Selection
  const DoctorSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Doctor</h2>
        <p className="text-gray-600">Select a specialist or let us assign one randomly</p>
      </div>

      <div className="mb-6">
        <button
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          onClick={() => setSelectedDoctor({ id: 'random', name: 'Random Assignment' })}
        >
          <div className="text-center">
            <div className="text-blue-600 font-medium">🎲 Random Doctor Assignment</div>
            <div className="text-sm text-gray-500 mt-1">Let us match you with an available specialist</div>
          </div>
        </button>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="flex items-center space-x-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm">{doctor.experience} experience</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600 ml-1">{doctor.rating} • {doctor.availability}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 4: Appointment Details
  const AppointmentDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h2>
        <p className="text-gray-600">Choose your preferred date, time, and appointment type</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.appointmentType}
            onChange={(e) => handleInputChange('appointmentType', e.target.value)}
          >
            <option value="">Select appointment type</option>
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Time *</label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`p-2 text-sm rounded-lg border transition-all ${
                formData.preferredTime === time
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => handleInputChange('preferredTime', time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any specific concerns or information for your doctor..."
        />
      </div>
    </div>
  );

  // Step 5: Confirmation & Reminders
  const ConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Bell className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation & Reminders</h2>
        <p className="text-gray-600">Review your booking and set up reminders</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Type:</span>
            <span className="font-medium">{isAnonymous ? 'Anonymous' : 'Regular'}</span>
          </div>
          {!isAnonymous && formData.fullName && (
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{formData.fullName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{selectedDoctor?.name || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Appointment Type:</span>
            <span className="font-medium">{formData.appointmentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">{formData.preferredDate} at {formData.preferredTime}</span>
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Reminder Settings</h3>
        
        {!isAnonymous && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>SMS Reminders</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.smsReminder}
                  onChange={(e) => handleInputChange('smsReminder', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>Email Reminders</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailReminder}
                  onChange={(e) => handleInputChange('emailReminder', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.reminderTime}
            onChange={(e) => handleInputChange('reminderTime', e.target.value)}
          >
            <option value="1h">1 hour before</option>
            <option value="4h">4 hours before</option>
            <option value="24h">1 day before</option>
            <option value="48h">2 days before</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <AnonymityStep />;
      case 2: return <PatientInfoStep />;
      case 3: return <DoctorSelectionStep />;
      case 4: return <AppointmentDetailsStep />;
      case 5: return <ConfirmationStep />;
      default: return <AnonymityStep />;
    }
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', { isAnonymous, selectedDoctor, formData });
    alert('Appointment booked successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 5 && (
                <div className={`h-1 w-16 mx-2 ${step < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {currentStep} of 5
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg transition-all ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Previous
        </button>

        <button
          onClick={currentStep === 5 ? handleSubmit : nextStep}
          className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          {currentStep === 5 ? 'Book Appointment' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default BookingInterface;