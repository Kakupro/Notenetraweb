import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AppIcon from '../../components/AppIcon';
import CustomLogo from '../../components/ui/CustomLogo';

const BankStaffLoginPage = () => {
  const [email, setEmail] = useState('killnoymous@gmail.com');
  const [password, setPassword] = useState('Kaku@009');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const CONFIGURED_ADMIN_EMAIL = 'killnoymous@gmail.com';

  useEffect(() => {
    if (user) {
      if (user.email === CONFIGURED_ADMIN_EMAIL || user.email.includes('admin')) {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the auth context login which currently mocks a user
      await login(email, password);
      // The useEffect will handle redirect
    } catch (err) {
      setError("Invalid credentials (try killnoymous@gmail.com)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <CustomLogo design="custom" showText className="mx-auto h-12 w-auto mb-4" />
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            Bank Staff Login
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your admin account (Mock)
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email-address"
              name="email"
              type="email"
              required
              className="mb-2"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              <AppIcon name="AlertCircle" className="inline mr-1" size={16} />
              {error}
            </p>
          )}

          <div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in as Staff'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankStaffLoginPage;
