import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Button from '../components/Button';
import RequiredError from '../components/RequiredError';
import { signUp,department } from '../services/operations/AuthAPIs';
import axios from 'axios';

// import animationData from '../assets/registration-animation.json';

const SignUp = () => {
  const [step, setStep] = useState(1); // Form step control
  const [hidePassword, setHidePassword] = useState({
    password: true,
    confirmPassword: true,
  });
  const [departments,setdepartments]=useState([])
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the department list from the server
    axios.get("http://localhost:4000/api/v1/departments")
      .then(response => {
        console.log(response.data)
        setdepartments(response.data);
      })
      .catch(err => console.error("Error fetching departments:", err));
  }, []);
  const submitHandler = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Loading...');
    console.log(data);
    try {
      const response = await signUp(data);
      if (response) {
        navigate('/login');
      }
    } catch (e) {
      console.log('ERROR WHILE SIGNING UP:', e);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    setValue('role', 'user');
  }, [setValue]);

  const goToNextStep = () => setStep((prev) => prev + 1);
  const goToPreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold">Sign Up</h1>
          {/* <Lottie animationData={animationData} className="w-32 mx-auto" /> */}
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Step 1: Personal Details</h2>
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  placeholder="Username"
                  className="w-full border rounded p-2"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors?.username && <RequiredError>{errors.username.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  placeholder="Email"
                  className="w-full border rounded p-2"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors?.email && <RequiredError>{errors.email.message}</RequiredError>}
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
                {errors?.gender && <RequiredError>{errors.gender.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Step 2: Academic Details</h2>
              <div>
                <label htmlFor="marks10">Marks in Class 10 (%)</label>
                <input
                  id="marks10"
                  placeholder="Marks in Class 10"
                  className="w-full border rounded p-2"
                  type="number"
                  {...register('marks10', { required: 'Class 10 marks are required' })}
                />
                {errors?.marks10 && <RequiredError>{errors.marks10.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="marks12">Marks in Class 12 (%)</label>
                <input
                  id="marks12"
                  placeholder="Marks in Class 12"
                  className="w-full border rounded p-2"
                  type="number"
                  {...register('marks12', { required: 'Class 12 marks are required' })}
                />
                {errors?.marks12 && <RequiredError>{errors.marks12.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="arrears">Number of Arrears</label>
                <input
                  id="arrears"
                  placeholder="Number of Arrears"
                  className="w-full border rounded p-2"
                  type="number"
                  {...register('arrears', { required: 'Number of arrears is required' })}
                />
                {errors?.arrears && <RequiredError>{errors.arrears.message}</RequiredError>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i}>
                    <label htmlFor={`cgpa${i + 1}`}>CGPA Sem {i + 1}</label>
                    <input
                      id={`cgpa${i + 1}`}
                      placeholder={`CGPA for Semester ${i + 1}`}
                      className="w-full border rounded p-2"
                      type="number"
                      {...register(`cgpa${i + 1}`)} // Register each semester CGPA field
                    />
                    {errors?.[`cgpa${i + 1}`] && <RequiredError>{errors[`cgpa${i + 1}`]?.message}</RequiredError>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Step 3: Other Details</h2>
              <div>
                <label htmlFor="hostel">Hosteler/Day Scholar</label>
                <select
                  id="hostel"
                  className="w-full border rounded p-2"
                  {...register('hostel', { required: 'This field is required' })}
                >
                  <option value="">Select</option>
                  <option value="Hosteler">Hosteler</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
                {errors?.hostel && <RequiredError>{errors.hostel.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="lateralEntry">Lateral Entry</label>
                <select
                  id="lateralEntry"
                  className="w-full border rounded p-2"
                  {...register('lateralEntry', { required: 'This field is required' })}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors?.lateralEntry && <RequiredError>{errors.lateralEntry.message}</RequiredError>}
              </div>
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
                {errors?.dept && <RequiredError>{errors.dept.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Final Step: Review and Submit</h2>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder="Password"
                  className="w-full border rounded p-2"
                  type={hidePassword.password ? 'password' : 'text'}
                  {...register('password', { required: 'Password is required' })}
                />
                {errors?.password && <RequiredError>{errors.password.message}</RequiredError>}
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full border rounded p-2"
                  type={hidePassword.confirmPassword ? 'password' : 'text'}
                  {...register('confirmPassword', { required: 'Re-enter your password' })}
                />
                {errors?.confirmPassword && <RequiredError>{errors.confirmPassword.message}</RequiredError>}
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-5">
            {step > 1 && (
              <Button onClick={goToPreviousStep} varient="secondary" type="button" className='mr-5'>
                Previous
              </Button>
            )}
            {step < 4 ? (
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
