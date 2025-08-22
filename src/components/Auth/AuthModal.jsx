import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { 
    login, 
    signup, 
    resetPassword, 
    socialLogin,
    sendEmailVerification 
  } = useAuth();
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setMessage('');
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
      });
    }
  }, [isOpen]);

  const switchMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let result;
      if (showResetPassword) {
        // Handle password reset
        result = await resetPassword(formData.email);
        if (result.success) {
          setMessage(result.message);
          setShowResetPassword(false);
        } else {
          setError(result.error || 'Failed to send password reset email.');
        }
      } else if (isLogin) {
        // Login
        result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        result = await signup(formData.email, formData.password, formData.name);
        if (result.success) {
          setMessage(result.message || 'Account created successfully! Please check your email to verify your account.');
          setIsLogin(true);
        } else {
          setError(result.error || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Auth error:', err);
    }

    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      const result = await socialLogin(provider);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Social login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during social login.');
      console.error('Social login error:', err);
    }
    
    setLoading(false);
  };
  
  const handleResendVerification = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await sendEmailVerification();
      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error || 'Failed to send verification email.');
      }
    } catch (err) {
      setError('An error occurred while sending verification email.');
      console.error('Verification email error:', err);
    }
    
    setLoading(false);
  };

  const renderResetPassword = () => (
    <div className="auth-content">
      <h3>Reset Password</h3>
      <p>Enter your email and we'll send you a link to reset your password.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group with-icon">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? <span className="auth-spinner">⏳</span> : 'Send Reset Link'}
        </button>
        
        <button 
          type="button" 
          className="auth-text-btn"
          onClick={() => setShowResetPassword(false)}
        >
          <FaArrowLeft /> Back to {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );

  const renderAuthForm = () => (
    <div className="auth-content">
      <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
      <p>{isLogin ? 'Sign in to continue' : 'Join us today!'}</p>
      
      <div className="social-buttons">
        <button 
          type="button" 
          className="social-btn google"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <FaGoogle /> {isLogin ? 'Sign in' : 'Sign up'} with Google
        </button>
        <button 
          type="button" 
          className="social-btn github"
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
        >
          <FaGithub /> {isLogin ? 'Sign in' : 'Sign up'} with GitHub
        </button>
      </div>
      
      <div className="divider">
        <span>OR</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <div className="form-group with-icon">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group with-icon">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        {!isLogin && (
          <div className="form-group with-icon">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        )}
        
        {isLogin && (
          <div className="auth-options">
            <button 
              type="button" 
              className="auth-text-btn"
              onClick={() => setShowResetPassword(true)}
            >
              Forgot password?
            </button>
          </div>
        )}
        
        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        
        <button 
          type="submit" 
          className="auth-submit"
          disabled={loading}
        >
          {loading ? (
            <span className="auth-spinner">⏳</span>
          ) : isLogin ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </button>
        
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            onClick={switchMode} 
            className="auth-switch-btn"
            disabled={loading}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
        
        {!isLogin && (
          <p className="auth-tos">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
        
        {isLogin && error?.includes('verify your email') && (
          <div className="auth-verify-email">
            <p>Didn't receive the verification email?</p>
            <button 
              type="button" 
              onClick={handleResendVerification}
              className="auth-text-btn"
              disabled={loading}
            >
              Resend verification email
            </button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="auth-modal-overlay" onClick={onClose}>
          <motion.div 
            className="auth-modal"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <button className="auth-close-btn" onClick={onClose} disabled={loading}>
              ×
            </button>
            {showResetPassword ? renderResetPassword() : renderAuthForm()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
