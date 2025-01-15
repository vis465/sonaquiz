import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import RequiredError from '../components/RequiredError';
import { signUp } from '../services/operations/AuthAPIs';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [hidePassword, setHidePassword] = useState({
    password: true,
    confirmPassword: true,
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/departments')
      .then(response => setDepartments(response.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  useEffect(() => {
    setValue('role', 'user');
  }, [setValue]);

  const goToNextStep = () => setStep(prev => prev + 1);
  const goToPreviousStep = () => setStep(prev => prev - 1);

  const submitHandler = async (data) => {
    setLoading(true);
    console.log(data)
    const toastId = toast.loading('Loading...');
    try {
      console.log(data);
      const response = await signUp(data);
      if (response) navigate('/login');
    } catch (e) {
      console.error('Error during sign-up:', e);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-5">Sign Up</h1>

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold">Step 1: Personal Details</h2>
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  className="w-full border rounded p-2"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <RequiredError>{errors.username.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full border rounded p-2"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <RequiredError>{errors.email.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className="w-full border rounded p-2"
                  {...register('gender', { required: 'Gender is required' })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <RequiredError>{errors.gender.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="registerNumber">Register Number</label>
                <input
                  id="registerNumber"
                  className="w-full border rounded p-2"
                  {...register('registerNumber', { required: 'Register number is required' })}
                />
                {errors.registerNumber && <RequiredError>{errors.registerNumber.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold">Step 2: Academic Details</h2>
              <div>
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  className="w-full border rounded p-2"
                  {...register('dept', { required: 'Department is required' })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.abbreviation} value={dept.abbreviation}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.dept && <RequiredError>{errors.dept.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="year">Year</label>
                <select
                  id="year"
                  className="w-full border rounded p-2"
                  {...register('year', { 
                    required: 'Year is required',
                    setValueAs: v => parseInt(v)
                  })}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {errors.year && <RequiredError>{errors.year.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="class">Class</label>
                <input
                  id="class"
                  className="w-full border rounded p-2"
                  {...register('class', { required: 'Class is required' })}
                />
                {errors.class && <RequiredError>{errors.class.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {/* Step 3: Academic Performance */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold">Step 3: Academic Performance</h2>
              <div>
                <label htmlFor="marks10">Class 10 Marks (%)</label>
                <input
                  id="marks10"
                  type="number"
                  className="w-full border rounded p-2"
                  {...register('marks10', { 
                    required: 'Class 10 marks are required',
                    setValueAs: v => parseInt(v)
                  })}
                />
                {errors.marks10 && <RequiredError>{errors.marks10.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="marks12">Class 12 Marks (%)</label>
                <input
                  id="marks12"
                  type="number"
                  className="w-full border rounded p-2"
                  {...register('marks12', { 
                    required: 'Class 12 marks are required',
                    setValueAs: v => parseInt(v)
                  })}
                />
                {errors.marks12 && <RequiredError>{errors.marks12.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="arrears">Number of Arrears</label>
                <input
                  id="arrears"
                  type="number"
                  className="w-full border rounded p-2"
                  {...register('arrears', { 
                    required: 'Number of arrears is required',
                    setValueAs: v => parseInt(v)
                  })}
                />
                {errors.arrears && <RequiredError>{errors.arrears.message}</RequiredError>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i}>
                    <label htmlFor={`cgpa${i + 1}`}>CGPA Sem {i + 1}</label>
                    <input
                      id={`cgpa${i + 1}`}
                      type="number"
                      step="0.01"
                      className="w-full border rounded p-2"
                      {...register(`cgpa.${i}`, { 
                        setValueAs: v => v === '' ? 0 : parseFloat(v)
                      })}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Other Details */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold">Step 4: Other Details</h2>
              <div>
                <label htmlFor="hostelStatus">Hosteler/Day Scholar</label>
                <select
                  id="hostelStatus"
                  className="w-full border rounded p-2"
                  {...register('hostelStatus', { required: 'This field is required' })}
                >
                  <option value="">Select</option>
                  <option value="hosteler">Hosteler</option>
                  <option value="dayscholar">Day Scholar</option>
                </select>
                {errors.hostelStatus && <RequiredError>{errors.hostelStatus.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="admissionType">Type of Admission</label>
                <select
                  id="admissionType"
                  className="w-full border rounded p-2"
                  {...register('admissionType', { required: 'This field is required' })}
                >
                  <option value="">Select</option>
                  <option value="sws">SWS</option>
                  <option value="mgmt">Management</option>
                </select>
                {errors.admissionType && <RequiredError>{errors.admissionType.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="lateralEntry">Lateral Entry</label>
                <select
                  id="lateralEntry"
                  className="w-full border rounded p-2"
                  {...register('lateralEntry', { 
                    required: 'This field is required',
                    setValueAs: v => v === 'true'
                  })}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.lateralEntry && <RequiredError>{errors.lateralEntry.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {/* Password Details */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-semibold">Step 5: Password Details</h2>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={hidePassword.password ? 'password' : 'text'}
                  className="w-full border rounded p-2"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <RequiredError>{errors.password.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={hidePassword.confirmPassword ? 'password' : 'text'}
                  className="w-full border rounded p-2"
                  {...register('confirmPassword', { required: 'Re-enter your password' })}
                />
                {errors.confirmPassword && <RequiredError>{errors.confirmPassword.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-5">
            {step > 1 && (
              <Button onClick={goToPreviousStep} varient="secondary" type="button" className="mr-5">
                Previous
              </Button>
            )}
            {step < 5 ? (
              <Button onClick={goToNextStep} varient="primary" type="button">
                Next
              </Button>
            ) : (
              <Button disabled={loading} varient="primary" type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignUp;