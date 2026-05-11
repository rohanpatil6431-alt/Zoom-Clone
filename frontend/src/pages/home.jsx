import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Box } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <>
            <div className="navBar">
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    minWidth: 'fit-content'
                }}>
                    <h2 style={{
                        background: 'linear-gradient(45deg, #0ea5e9, #22d3ee)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '2px',
                        fontSize: 'clamp(0.85rem, 4vw, 1.5rem)',
                        fontWeight: 300,
                        margin: 0,
                    }}>Zoom</h2>
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                }}>
                    <IconButton
                        onClick={() => navigate("/history")}
                        sx={{
                            color: '#0ea5e9',
                            transition: 'all 0.3s ease',
                            padding: { xs: '0.4rem', sm: '0.5rem', md: '0.625rem' },
                            '&:hover': {
                                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <RestoreIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }} />
                    </IconButton>
                    <span style={{
                        color: '#64748b',
                        fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                        display: window.innerWidth < 640 ? 'none' : 'block'
                    }}>History</span>

                    <Button
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}
                        endIcon={<LogoutIcon />}
                        sx={{
                            ml: { xs: 1, sm: 1.5, md: 2 },
                            background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                            color: '#ffffff',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '30px',
                            padding: { xs: '0.5rem 0.75rem', sm: '0.6rem 1.5rem', md: '0.6rem 1.5rem' },
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.95rem' },
                            transition: 'all 0.3s ease',
                            minWidth: 'fit-content',
                            '&:hover': {
                                boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
                                transform: 'translateY(-2px)',
                            },
                            '& .MuiButton-endIcon': {
                                display: { xs: 'none', sm: 'inherit' },
                            },
                        }}
                    >
                        {window.innerWidth < 640 ? 'Exit' : 'Logout'}
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div style={{
                        maxWidth: '500px',
                        animation: 'fadeInUp 0.8s ease',
                        width: '100%',
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(1.4rem, 5vw, 2.5rem)',
                            fontWeight: 300,
                            lineHeight: 1.3,
                            marginBottom: 'clamp(1rem, 3vw, 2rem)',
                            color: '#0f172a',
                            margin: '0 0 clamp(1rem, 3vw, 2rem) 0',
                        }}>
                            <span style={{
                                background: 'linear-gradient(45deg, #0ea5e9, #22d3ee)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>Premium Video Calls</span> with Crystal Quality
                        </h2>

                        <Box sx={{
                            display: 'flex',
                            gap: { xs: "8px", sm: "12px", md: "12px" },
                            alignItems: 'center',
                            flexWrap: { xs: 'wrap', sm: 'nowrap', md: 'nowrap' },
                            '& .MuiTextField-root': {
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '10px',
                                    '& fieldset': {
                                        borderColor: '#cbd5e1',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#93c5fd',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#0ea5e9',
                                        boxShadow: '0 0 10px rgba(14, 165, 233, 0.12)',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#0f172a',
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    '&::placeholder': {
                                        color: '#64748b',
                                        opacity: 1,
                                    },
                                },
                            },
                        }}>
                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                id="meeting-code"
                                label="Meeting Code"
                                variant="outlined"
                                value={meetingCode}
                                placeholder="Enter code"
                                fullWidth
                                size="small"
                                sx={{
                                    maxWidth: { xs: '100%', sm: '240px', md: '280px' },
                                }}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                sx={{
                                    background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    padding: { xs: '0.65rem 1rem', sm: '0.8rem 1.5rem', md: '0.8rem 2rem' },
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
                                    minWidth: 'fit-content',
                                    whiteSpace: 'nowrap',
                                    width: { xs: '100%', sm: 'auto', md: 'auto' },
                                    '&:hover': {
                                        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Join Call
                            </Button>
                        </Box>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="Video Call" style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }} />
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent)