import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card';
import { useAuthStore } from '../../stores/authStore';

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const navigate = useNavigate();
  const { login, verifyTwoFactor, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.usernameOrEmail, data.password);
    
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else if (!error?.includes('2FA')) {
      // Check if 2FA is required
      setRequiresTwoFactor(true);
      // In a real app, you'd get the tempToken from the login response
      setTempToken('temp_token_from_response');
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFactorCode.trim()) {
      toast.error('Please enter the 2FA code');
      return;
    }

    const success = await verifyTwoFactor(tempToken, twoFactorCode);
    
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  if (requiresTwoFactor) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            <p className="text-sm text-secondary-600 mb-4">
              Please enter the 6-digit code from your authenticator app.
            </p>
            
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            
            {error && (
              <p className="text-sm text-error-600">{error}</p>
            )}
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => setRequiresTwoFactor(false)}
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Verify
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <p className="text-sm text-secondary-600 text-center mt-2">
          Sign in to your EduConnect account
        </p>
      </CardHeader>
      
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email or Username"
            type="text"
            leftIcon={Mail}
            placeholder="Enter your email or username"
            {...register('usernameOrEmail', { 
              required: 'Email or username is required' 
            })}
            error={errors.usernameOrEmail?.message}
          />
          
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            leftIcon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            placeholder="Enter your password"
            {...register('password', { 
              required: 'Password is required' 
            })}
            error={errors.password?.message}
          />
          
          <div className="flex items-center justify-between">
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
          
          {error && (
            <p className="text-sm text-error-600">{error}</p>
          )}
          
          <Button
            type="submit"
            leftIcon={LogIn}
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>
          
          <div className="text-center">
            <span className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};