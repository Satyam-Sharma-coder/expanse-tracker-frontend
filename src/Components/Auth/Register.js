import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import Button from '../Button/Button'

function Register({ switchToLogin }) {
    const { register, error, loading, verifyOTP, resendOTP } = useGlobalContext()
    const [step, setStep] = useState('register') // 'register' or 'verify'
    const [userId, setUserId] = useState(null)
    const [authMethod, setAuthMethod] = useState('email') // 'email' or 'phone'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: ''
    })

    const { name, email, phone, password, confirmPassword, otp } = formData

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            return
        }
        
        const registerData = {
            name,
            password,
            ...(authMethod === 'email' ? { email } : { phone })
        }
        
        const result = await register(registerData)
        if (result.success) {
            setUserId(result.userId)
            setStep('verify')
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        
        const result = await verifyOTP({ userId, otp })
        if (result.success) {
            setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' })
            setStep('register')
        }
    }

    const handleResendOTP = async () => {
        await resendOTP({ userId })
    }

    if (step === 'verify') {
        return (
            <RegisterStyled>
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
                        <span onClick={() => setStep('register')} className="back-link">
                            Back to Registration
                        </span>
                    </div>
                </div>
            </RegisterStyled>
        )
    }

    return (
        <RegisterStyled>
            <div className="auth-container">
                <h2>Create Account</h2>
                <p>Join us to start tracking your expenses</p>
                
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
                
                {password !== confirmPassword && confirmPassword && (
                    <div className="error">Passwords do not match</div>
                )}
                
                <form onSubmit={handleRegister}>
                    <div className="input-control">
                        <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
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
                    
                    <div className="input-control">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <Button
                        name={loading ? 'Creating Account...' : 'Create Account'}
                        bPad={'1rem 2rem'}
                        bRad={'10px'}
                        bg={'var(--color-accent)'}
                        color={'#fff'}
                        disabled={loading || password !== confirmPassword}
                    />
                </form>
                
                <p className="switch-auth">
                    Already have an account?{' '}
                    <span onClick={switchToLogin}>Sign In</span>
                </p>
            </div>
        </RegisterStyled>
    )
}

const RegisterStyled = styled.div`
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

export default Register