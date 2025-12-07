import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff, Zap, AlertCircle, KeyRound, CheckCircle2, X, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '../store/useProfileStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginUser } = useProfileStore();

    const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
    const [tab, setTab] = useState<'login' | 'register'>(initialTab);

    // Form inputs
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // Register fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Forgot Password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState<1 | 2>(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    // Loading & Feedback
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE_URL = 'http://localhost:3000';

    // Password strength calculator
    const calculatePasswordStrength = (pass: string) => {
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
        return score; // 0 - 5
    };

    const passwordStrength = calculatePasswordStrength(password);

    const getStrengthLabel = (score: number) => {
        if (score <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
        if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
    };

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval: any = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailOrPhone, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            loginUser({
                email: data.user.email,
                token: data.token,
                user: data.user,
            });

            setSuccessMessage('Successfully authenticated! Redirecting to Guardian Dashboard...');
            setTimeout(() => {
                navigate('/');
            }, 700);
        } catch (err: any) {
            setErrorMessage(err.message || 'Server connection failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match. Please verify both password fields.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: emailOrPhone, phone, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Registration failed.');
            }

            loginUser({
                email: data.user.email,
                token: data.token,
                user: data.user,
            });

            setSuccessMessage('Account created successfully! Welcome to Guardian-Her.');
            setTimeout(() => {
                navigate('/');
            }, 600);
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');
        setForgotLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to request reset code.');
            }

            if (data.previewUrl) {
                setForgotSuccess(`Verification code dispatched to ${forgotEmail}! (OTP: ${data.otpCode})`);
            } else {
                setForgotSuccess(`Verification code sent to ${forgotEmail}! (OTP: ${data.otpCode})`);
            }
            if (data.otpCode) {
                setResetCode(data.otpCode);
            }
            setForgotStep(2);
            setResendTimer(30);
        } catch (err: any) {
            setForgotError(err.message || 'Error processing request.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');
        setForgotLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to reset password.');
            }

            setForgotSuccess('Password updated successfully! Transitioning to Sign In...');
            setTimeout(() => {
                setShowForgotPassword(false);
                setTab('login');
                setEmailOrPhone(forgotEmail);
                setPassword(newPassword);
                setSuccessMessage('Password reset complete! Click Sign In to log in.');
            }, 1200);
        } catch (err: any) {
            setForgotError(err.message || 'Error resetting password.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleQuickDemoLogin = () => {
        setErrorMessage('');
        setSuccessMessage('');
        loginUser({
            email: 'demo@guardian.her',
            token: 'demo_token_123',
            user: {
                name: 'Aditi Sharma',
                phone: '+919876543210',
                medicalNotes: 'No known allergies. Blood group O+',
                contacts: [
                    { id: '1', name: 'Mom', phone: '+919800011122' },
                    { id: '2', name: 'Sister', phone: '+919800033344' },
                ],
            },
        });

        setSuccessMessage('Logged in with Demo Account!');
        setTimeout(() => {
            navigate('/');
        }, 500);
    };

    return (
        <div className="min-h-screen w-full bg-[#FDFBF7] dark:bg-charcoal-900 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Ambient Animated Orbs */}
            <motion.div
                className="absolute top-12 left-10 w-48 h-48 bg-rose-200/40 dark:bg-rose-900/20 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-12 right-10 w-56 h-56 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Language Switcher - Top Right */}
            <div className="absolute top-4 right-4 z-20">
                <LanguageSwitcher />
            </div>

            {/* Header & Logo */}
            <div className="w-full max-w-md space-y-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center space-y-2"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/25 mb-1">
                        <Shield className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-charcoal-900 dark:text-cream-50 tracking-tight">
                        Guardian-Her
                    </h1>
                    <p className="text-sm text-charcoal-600 dark:text-lavender-200 max-w-xs">
                        Your Personal AI Emergency & Safety Guardian
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex bg-white/70 dark:bg-charcoal-800/70 p-1.5 rounded-2xl shadow-sm border border-lavender-100 dark:border-charcoal-700 backdrop-blur-md">
                    <button
                        onClick={() => {
                            setTab('login');
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                        className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                            tab === 'login'
                                ? 'bg-charcoal-800 text-white dark:bg-rose-500 dark:text-white shadow-md'
                                : 'text-charcoal-600 dark:text-lavender-200 hover:text-charcoal-900'
                        }`}
                    >
                        {t('auth.sign_in_tab')}
                    </button>
                    <button
                        onClick={() => {
                            setTab('register');
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                        className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                            tab === 'register'
                                ? 'bg-charcoal-800 text-white dark:bg-rose-500 dark:text-white shadow-md'
                                : 'text-charcoal-600 dark:text-lavender-200 hover:text-charcoal-900'
                        }`}
                    >
                        {t('auth.create_account_tab')}
                    </button>
                </div>

                {/* Card Container */}
                <Card className="p-6 md:p-8 backdrop-blur-xl bg-white/80 dark:bg-charcoal-800/90 border border-white/60 dark:border-charcoal-700 shadow-xl rounded-3xl">
                    {/* Error / Success Feedback */}
                    <AnimatePresence mode="wait">
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/50 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-sm"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50 rounded-xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-sm"
                            >
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{successMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {tab === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Email or Phone Number
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type="text"
                                        placeholder="yourname@gmail.com"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(true);
                                            setForgotEmail(emailOrPhone);
                                            setForgotStep(1);
                                            setForgotError('');
                                            setForgotSuccess('');
                                        }}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between pt-1 px-1">
                                <label className="flex items-center gap-2 text-xs text-charcoal-600 dark:text-lavender-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="rounded border-lavender-300 text-rose-500 focus:ring-rose-400 accent-rose-500 w-4 h-4"
                                    />
                                    <span>Remember me on this device</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-2 bg-charcoal-800 hover:bg-charcoal-900 dark:bg-rose-500 dark:hover:bg-rose-600 text-white shadow-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Signing In...</span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type="text"
                                        placeholder="e.g. Aditi Sharma"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type="email"
                                        placeholder="aditi@example.com"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Create Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {password && (
                                    <div className="pt-1.5 px-1 space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-charcoal-500 dark:text-lavender-300">Password Strength:</span>
                                            <span className={`font-semibold ${getStrengthLabel(passwordStrength).text}`}>
                                                {getStrengthLabel(passwordStrength).label}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 dark:bg-charcoal-700 rounded-full overflow-hidden flex gap-1">
                                            <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 1 ? getStrengthLabel(passwordStrength).color : 'bg-transparent'}`} />
                                            <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 3 ? getStrengthLabel(passwordStrength).color : 'bg-transparent'}`} />
                                            <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 4 ? getStrengthLabel(passwordStrength).color : 'bg-transparent'}`} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 dark:text-lavender-300 ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400 dark:text-lavender-400" />
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 top-3.5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword && (
                                    <p className={`text-xs ml-1 font-medium ${password === confirmPassword ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                        {password === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-2 bg-charcoal-800 hover:bg-charcoal-900 dark:bg-rose-500 dark:hover:bg-rose-600 text-white shadow-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Creating Account...</span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create Account <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Quick Demo Login Option */}
                    <div className="mt-6 pt-5 border-t border-lavender-100 dark:border-charcoal-700">
                        <button
                            type="button"
                            onClick={handleQuickDemoLogin}
                            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-300 font-medium text-sm rounded-xl border border-rose-200 dark:border-rose-800/40 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Zap className="w-4 h-4 fill-rose-500 text-rose-500" />
                            <span>Quick Demo Sign In (1-Click)</span>
                        </button>
                        <p className="text-center text-xs text-charcoal-500 dark:text-lavender-400 mt-2">
                            Demo account comes pre-configured with emergency contacts & sample profile.
                        </p>
                    </div>
                </Card>

                {/* Return Home / Skip link */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/welcome')}
                        className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 dark:text-lavender-300 dark:hover:text-white transition-colors"
                    >
                        ← Back to Welcome Screen
                    </button>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-white dark:bg-charcoal-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-lavender-100 dark:border-charcoal-700 relative"
                        >
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-700 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-2xl">
                                    <KeyRound size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-charcoal-800 dark:text-cream-50">
                                        Reset Password
                                    </h3>
                                    <p className="text-xs text-charcoal-500 dark:text-lavender-300">
                                        {forgotStep === 1 ? 'Enter your email to receive a reset code' : 'Enter code & set your new password'}
                                    </p>
                                </div>
                            </div>

                            {forgotError && (
                                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>{forgotError}</span>
                                </div>
                            )}

                            {forgotSuccess && (
                                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    <span>{forgotSuccess}</span>
                                </div>
                            )}

                            {forgotStep === 1 ? (
                                <form onSubmit={handleSendResetCode} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold uppercase text-charcoal-600 dark:text-lavender-300 ml-1">
                                            Registered Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-charcoal-400" />
                                            <Input
                                                type="email"
                                                placeholder="yourname@gmail.com"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="block text-xs font-semibold uppercase text-charcoal-600 dark:text-lavender-300">
                                                6-Digit Verification Code
                                            </label>
                                            {resendTimer > 0 ? (
                                                <span className="text-xs text-charcoal-400">Resend in {resendTimer}s</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendResetCode}
                                                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                                                >
                                                    <RefreshCw size={12} /> Resend Code
                                                </button>
                                            )}
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="123456"
                                            value={resetCode}
                                            onChange={(e) => setResetCode(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold uppercase text-charcoal-600 dark:text-lavender-300 ml-1">
                                            New Password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            minLength={6}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                        disabled={forgotLoading}
                                    >
                                        {forgotLoading ? 'Resetting Password...' : 'Reset & Update Password'}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(1)}
                                        className="w-full text-center text-xs text-charcoal-500 hover:underline pt-1"
                                    >
                                        ← Re-enter email address
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
