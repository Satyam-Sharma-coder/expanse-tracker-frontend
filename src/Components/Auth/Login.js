import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import Button from '../Button/Button'

function Login({ switchToRegister }) {
    const { login, error, loading, verifyOTP, resendOTP, forgotPassword, resetPassword } = useGlobalContext()
    const [authMethod, setAuthMethod] = useState('email') // 'email' or 'phone'
    const [step, setStep] = useState('login') // 'login', 'verify', 'forgot', 'reset'
    const [userId, setUserId] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        otp: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const { email, phone, password, otp, newPassword, confirmNewPassword } = formData

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const loginData = {
            password,
            ...(authMethod === 'email' ? { email } : { phone })
        }
        
        const result = await login(loginData)
        if (result.success) {
            setFormData({ email: '', phone: '', password: '', otp: '', newPassword: '', confirmNewPassword: '' })
        } else if (result.needsVerification) {
            setUserId(result.userId)
            setStep('verify')
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        const result = await verifyOTP({ userId, otp })
        if (result.success) {
            setFormData({ email: '', phone: '', password: '', otp: '', newPassword: '', confirmNewPassword: '' })
            setStep('login')
        }
    }

    const handleResendOTP = async () => {
        await resendOTP({ userId })
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        const forgotData = authMethod === 'email' ? { email } : { phone }
        
        const result = await forgotPassword(forgotData)
        if (result.success) {
            setUserId(result.userId)
            setStep('reset')
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmNewPassword) return
        
        const result = await resetPassword({ userId, otp, newPassword })
        if (result.success) {
            setFormData({ email: '', phone: '', password: '', otp: '', newPassword: '', confirmNewPassword: '' })
            setStep('login')
        }
    }

    if (step === 'verify') {
        return (
            <LoginStyled>
                <div className="auth-container">
                    <h2>Verify Your Account</h2>
                    <p>Enter the OTP sent to your {authMethod}</p>
                    
                    {error && <div className="error">{error}</div>}
                    
                    
                    <form onSubmit={handleVerifyOTP}>
                        <div className="input-control">
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                placeholder="Enter 6-digit OTP"
                                onChange={handleChange}
                                maxLength="6"
                                required
                            />
                        </div>
                        
                        <Button
                            name={loading ? 'Verifying...' : 'Verify OTP'}
                            bPad={'1rem 2rem'}
                            bRad={'10px'}
                            bg={'var(--color-accent)'}
                            color={'#fff'}
                            disabled={loading}
                        />
                    </form>
                    
                    <div className="otp-actions">
                        <span onClick={handleResendOTP} className="resend-link">
                            Resend OTP
                        </span>
                        <span onClick={() => setStep('login')} className="back-link">
                            Back to Login
                        </span>
                    </div>
                </div>
            </LoginStyled>
        )
    }

    if (step === 'forgot') {
        return (
            <LoginStyled>
                <div className="auth-container">
                    <h2>Forgot Password</h2>
                    <p>Enter your {authMethod} to receive OTP</p>
                    
                    <div className="auth-method-selector">
                        <button
                            type="button"
                            className={authMethod === 'email' ? 'active' : ''}
                            onClick={() => setAuthMethod('email')}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            className={authMethod === 'phone' ? 'active' : ''}
                            onClick={() => setAuthMethod('phone')}
                        >
                            Phone
                        </button>
                    </div>
                    
                    {error && <div className="error">{error}</div>}
                  
                    
                    <form onSubmit={handleForgotPassword}>
                        {authMethod === 'email' ? (
                            <div className="input-control">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="input-control">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        
                        <Button
                            name={loading ? 'Sending OTP...' : 'Send OTP'}
                            bPad={'1rem 2rem'}
                            bRad={'10px'}
                            bg={'var(--color-accent)'}
                            color={'#fff'}
                            disabled={loading}
                        />
                    </form>
                    
                    <p className="switch-auth">
                        Remember your password?{' '}
                        <span onClick={() => setStep('login')}>Sign In</span>
                    </p>
                </div>
            </LoginStyled>
        )
    }

    if (step === 'reset') {
        return (
            <LoginStyled>
                <div className="auth-container">
                    <h2>Reset Password</h2>
                    <p>Enter OTP and new password</p>
                    
                    {error && <div className="error">{error}</div>}
                    
                    {newPassword !== confirmNewPassword && confirmNewPassword && (
                        <div className="error">Passwords do not match</div>
                    )}
                    
                    <form onSubmit={handleResetPassword}>
                        <div className="input-control">
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                placeholder="Enter 6-digit OTP"
                                onChange={handleChange}
                                maxLength="6"
                                required
                            />
                        </div>
                        
                        <div className="input-control">
                            <input
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                placeholder="New Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="input-control">
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                placeholder="Confirm New Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <Button
                            name={loading ? 'Resetting...' : 'Reset Password'}
                            bPad={'1rem 2rem'}
                            bRad={'10px'}
                            bg={'var(--color-accent)'}
                            color={'#fff'}
                            disabled={loading || newPassword !== confirmNewPassword}
                        />
                    </form>
                    
                    <p className="switch-auth">
                        Remember your password?{' '}
                        <span onClick={() => setStep('login')}>Sign In</span>
                    </p>
                </div>
            </LoginStyled>
        )
    }

    return (
        <LoginStyled>
            <div className="auth-container">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
                
                <div className="auth-method-selector">
                    <button
                        type="button"
                        className={authMethod === 'email' ? 'active' : ''}
                        onClick={() => setAuthMethod('email')}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        className={authMethod === 'phone' ? 'active' : ''}
                        onClick={() => setAuthMethod('phone')}
                    >
                        Phone
                    </button>
                </div>
                
                {error && <div className="error">{error}</div>}
                
                
                <form onSubmit={handleLogin}>
                    {authMethod === 'email' ? (
                        <div className="input-control">
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ) : (
                        <div className="input-control">
                            <input
                                type="tel"
                                name="phone"
                                value={phone}
                                placeholder="Phone Number"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    
                    <div className="input-control">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <Button
                        name={loading ? 'Signing In...' : 'Sign In'}
                        bPad={'1rem 2rem'}
                        bRad={'10px'}
                        bg={'var(--color-accent)'}
                        color={'#fff'}
                        disabled={loading}
                    />
                </form>
                
                <p className="forgot-password">
                    <span onClick={() => setStep('forgot')}>Forgot Password?</span>
                </p>
                
                <p className="switch-auth">
                    Don't have an account?{' '}
                    <span onClick={switchToRegister}>Sign Up</span>
                </p>
            </div>
        </LoginStyled>
    )
}

const LoginStyled = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .auth-container {
        background: rgba(255, 255, 255, 0.95);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        width: 100%;
        max-width: 400px;
        text-align: center;
        
        h2 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            font-size: 2rem;
        }
        
        p {
            color: var(--primary-color2);
            margin-bottom: 2rem;
        }
        
        .auth-method-selector {
            display: flex;
            margin-bottom: 2rem;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid #e1e1e1;
            
            button {
                flex: 1;
                padding: 1rem;
                border: none;
                background: #f8f9fa;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &.active {
                    background: var(--color-accent);
                    color: white;
                }
                
                &:hover:not(.active) {
                    background: #e9ecef;
                }
            }
        }
        
        form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .input-control input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e1e1e1;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            
            &:focus {
                outline: none;
                border-color: var(--color-accent);
            }
        }
        
        button {
            width: 100%;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }
            
            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }
        }
        
        .forgot-password {
            margin-top: 1rem;
            margin-bottom: 1rem;
            
            span {
                color: var(--color-accent);
                cursor: pointer;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        
        .switch-auth {
            margin-top: 2rem;
            color: var(--primary-color);
            
            span {
                color: var(--color-accent);
                cursor: pointer;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        
        .otp-actions {
            margin-top: 2rem;
            display: flex;
            justify-content: space-between;
            
            .resend-link, .back-link {
                color: var(--color-accent);
                cursor: pointer;
                font-weight: 600;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            border: 1px solid #fcc;
        }
    }
`

export default Login 