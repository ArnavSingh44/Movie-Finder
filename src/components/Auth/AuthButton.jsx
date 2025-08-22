import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AuthButton.css';

const AuthButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const toggleAuth = () => setIsOpen(!isOpen);
  const switchMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    console.log('Form submitted:', { ...formData, isLogin });
  };

  return (
    <div className="auth-container">
      <motion.button 
        className="auth-toggle"
        onClick={toggleAuth}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '✕' : 'Login / Sign Up'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="auth-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h3>{isLogin ? 'Login' : 'Create Account'}</h3>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="auth-submit">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
              <p className="auth-switch">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={switchMode} className="auth-switch-btn">
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthButton;
