import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { Switch } from "components/ui/switch";
import { Badge } from "components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CalendarIcon, CheckCircle2, Loader2, UserIcon, UserXIcon } from "lucide-react";
import { format } from "date-fns";

// Mock doctor data
const doctors = [
  {
    id: "1",
    name: "Dr. Nguyen Van A",
    specialty: "HIV Specialist",
    experience: "12 years",
    image: "/doctors/doctor1.jpg",
    languages: ["Vietnamese", "English"],
    schedule: "Mon, Wed, Fri",
  },
  {
    id: "2",
    name: "Dr. Tran Thi B",
    specialty: "Infectious Disease",
    experience: "8 years",
    image: "/doctors/doctor2.jpg",
    languages: ["Vietnamese", "French"],
    schedule: "Tue, Thu, Sat",
  },
];

const availableTimes = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const DoctorBooking=({})=> {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    anonymous: false,
    patientInfo: null,
    doctor: null,
    date: null,
    time: null,
    reason: "",
    sendReminders: true,
    reminderMethod: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step handlers
  const handleBookingType = (type) => {
    setBookingData({ ...bookingData, anonymous: type === 'anonymous' });
    setStep(2);
  };

  const handlePatientInfo = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const patientInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      birthdate: formData.get("birthdate"),
    };
    setBookingData({ ...bookingData, patientInfo });
    setStep(3);
  };

  const handleDoctorSelection = (doctorId) => {
    setBookingData({ ...bookingData, doctor: doctorId });
    setStep(4);
  };

  const handleRandomDoctor = () => {
    setBookingData({ ...bookingData, doctor: null }); // null = random
    setStep(4);
  };

  const handleAppointmentDetails = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setBookingData({
      ...bookingData,
      date: formData.get("date"),
      time: formData.get("time"),
      reason: formData.get("reason"),
      sendReminders: formData.get("sendReminders") === "on",
      reminderMethod: formData.get("reminderMethod"),
    });
    setStep(5);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Appointment booked! ${bookingData.anonymous ? "Anonymous" : `For ${bookingData.patientInfo.firstName}`} with ${bookingData.doctor || "random doctor"} on ${bookingData.date} at ${bookingData.time}`);
    }, 1500);
  };

  const goBack = () => setStep(step - 1);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          HIV Treatment Consultation
        </h1>
        <p className="text-muted-foreground">
          Confidential and secure appointment booking
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  stepNumber === step
                    ? "bg-primary text-white"
                    : stepNumber < step
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {stepNumber}
              </motion.div>
              {stepNumber < 5 && (
                <div className={`w-16 h-1 ${stepNumber < step ? "bg-green-100" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          {/* STEP 1: Booking Type */}
          {step === 1 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Choose Booking Option
                </CardTitle>
                <p className="text-muted-foreground">
                  Your privacy is our priority
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <div
                      onClick={() => handleBookingType('anonymous')}
                      className={`p-6 border rounded-lg cursor-pointer transition-all ${
                        bookingData.anonymous
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span className="bg-primary text-white p-1 rounded-full">
                          <UserXIcon className="h-4 w-4" />
                        </span>
                        Book Anonymously
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        No personal information stored. Only contact details for reminders.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <div
                      onClick={() => handleBookingType('registered')}
                      className={`p-6 border rounded-lg cursor-pointer transition-all ${
                        !bookingData.anonymous
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span className="bg-primary text-white p-1 rounded-full">
                          <UserIcon className="h-4 w-4" />
                        </span>
                        Book with Patient Information
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        For personalized care and treatment history tracking.
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => handleBookingType(bookingData.anonymous ? 'anonymous' : 'registered')}
                    className="px-6"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Patient Info (Conditional) */}
          {step === 2 && !bookingData.anonymous && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Patient Information
                </CardTitle>
                <p className="text-muted-foreground">
                  All information is encrypted and secure
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePatientInfo}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender">
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="birthdate">Date of Birth</Label>
                      <Input id="birthdate" name="birthdate" type="date" />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={goBack}>
                      Back
                    </Button>
                    <Button type="submit" className="px-6">
                      Continue
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Doctor Selection */}
          {step === 3 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Select Your Doctor
                </CardTitle>
                <p className="text-muted-foreground">
                  Choose a specialist or let us assign one
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Button 
                      variant={!bookingData.doctor ? "default" : "outline"}
                      onClick={handleRandomDoctor}
                      className="flex-1"
                    >
                      Any Available Doctor
                    </Button>
                    <Button 
                      variant={bookingData.doctor ? "default" : "outline"}
                      disabled
                      className="flex-1"
                    >
                      Choose Specific Doctor
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <motion.div
                        key={doctor.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleDoctorSelection(doctor.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          bookingData.doctor === doctor.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={doctor.image} />
                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doctor.specialty} • {doctor.experience} experience
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="secondary">
                                {doctor.schedule}
                              </Badge>
                              {doctor.languages.map((lang) => (
                                <Badge key={lang} variant="outline">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!bookingData.doctor && step === 3}
                    className="px-6"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Appointment Details */}
          {step === 4 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Appointment Details
                </CardTitle>
                <p className="text-muted-foreground">
                  Select your preferred date and time
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppointmentDetails}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Preferred Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {bookingData.date ? format(new Date(bookingData.date), "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={bookingData.date ? new Date(bookingData.date) : undefined}
                              onSelect={(date) => 
                                setBookingData({...bookingData, date: format(date, "yyyy-MM-dd")})
                              }
                              initialFocus
                              disabled={(date) => date < new Date() || date.getDay() === 0}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Preferred Time *</Label>
                        <Select 
                          name="time"
                          value={bookingData.time}
                          onValueChange={(value) => setBookingData({...bookingData, time: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        placeholder="Briefly describe your reason (optional)"
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="reminders">Send reminders</Label>
                        <Switch
                          id="reminders"
                          name="sendReminders"
                          checked={bookingData.sendReminders}
                          onCheckedChange={(checked) => 
                            setBookingData({...bookingData, sendReminders: checked})
                          }
                        />
                      </div>

                      {bookingData.sendReminders && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label>Reminder Method</Label>
                          <Select
                            name="reminderMethod"
                            value={bookingData.reminderMethod}
                            onValueChange={(value) => 
                              setBookingData({...bookingData, reminderMethod: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={goBack}>
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!bookingData.date || !bookingData.time}
                      className="px-6"
                    >
                      Review Appointment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  Confirm Your Appointment
                </CardTitle>
                <p className="text-muted-foreground">
                  Please review before confirming
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="font-medium">
                        Your preferred time is available!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Type:</span>
                      <span className="font-medium">
                        {bookingData.anonymous ? "Anonymous" : "Registered"}
                      </span>
                    </div>

                    {!bookingData.anonymous && bookingData.patientInfo && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Patient:</span>
                        <span className="font-medium">
                          {bookingData.patientInfo.firstName} {bookingData.patientInfo.lastName}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">
                        {bookingData.doctor 
                          ? doctors.find(d => d.id === bookingData.doctor)?.name 
                          : "Any available doctor"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span className="font-medium">
                        {format(new Date(bookingData.date), "PPP")} at {bookingData.time}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reminders:</span>
                      <span className="font-medium">
                        {bookingData.sendReminders ? (
                          <Badge variant="outline">
                            {bookingData.reminderMethod === 'email' && 'Email'}
                            {bookingData.reminderMethod === 'sms' && 'SMS'}
                            {bookingData.reminderMethod === 'both' && 'Email & SMS'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">None</Badge>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                      <strong>Privacy Note:</strong> All information is encrypted and stored securely per healthcare regulations.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={goBack}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-lg shadow-xl text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Booking Your Appointment</h3>
            <p className="text-muted-foreground">
              Please wait while we secure your time slot...
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default DoctorBooking;