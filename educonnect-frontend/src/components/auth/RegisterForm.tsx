import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card';
import { useAuthStore } from '../../stores/authStore';

interface RegisterFormData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    const success = await registerUser(registerData);
    
    if (success) {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <p className="text-sm text-secondary-600 text-center mt-2">
          Join EduConnect and start your learning journey
        </p>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            leftIcon={User}
            placeholder="Enter your full name"
            {...register('fullName', { 
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Full name must be at least 2 characters'
              }
            })}
            error={errors.fullName?.message}
          />

          <Input
            label="Username"
            type="text"
            leftIcon={User}
            placeholder="Choose a username"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
            error={errors.username?.message}
          />
          
          <Input
            label="Email"
            type="email"
            leftIcon={Mail}
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            leftIcon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            placeholder="Create a password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
              }
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            leftIcon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Confirm your password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value) => 
                value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />
          
          {error && (
            <p className="text-sm text-error-600">{error}</p>
          )}
          
          <Button
            type="submit"
            leftIcon={UserPlus}
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
          
          <div className="text-center">
            <span className="text-sm text-secondary-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};