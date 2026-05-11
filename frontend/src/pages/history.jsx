import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Container } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fbff 0%, #eef3f8 100%)',
            padding: { xs: '1rem 0.5rem', sm: '2rem 1rem', md: '2rem' },
            animation: 'fadeIn 0.6s ease',
            '@keyframes fadeIn': {
                'from': { opacity: 0 },
                'to': { opacity: 1 },
            },
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: '0.5rem', sm: '1rem', md: '1rem' },
                marginBottom: { xs: '1rem', sm: '2rem', md: '2rem' },
                borderBottom: '1px solid rgba(14, 165, 233, 0.15)',
                paddingBottom: { xs: '0.75rem', sm: '1rem', md: '1rem' },
            }}>
                <IconButton
                    onClick={() => routeTo("/home")}
                    sx={{
                        color: '#00D9FF',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 217, 255, 0.1)',
                        },
                    }}
                >
                    <HomeIcon />
                </IconButton>
                <Typography variant="h4" sx={{
                    fontWeight: 300,
                    letterSpacing: '1px',
                    background: 'linear-gradient(45deg, #00D9FF, #00F5FF)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Meeting History
                </Typography>
            </Box>

            <Container maxWidth="md">
                {meetings.length !== 0 ? (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))', md: 'repeat(auto-fill, minmax(300px, 1fr))' },
                        gap: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    }}>
                        {meetings.map((meeting, i) => (
                            <Card
                                key={i}
                                sx={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '18px',
                                    transition: 'all 0.3s ease',
                                    animation: `slideInUp 0.6s ease ${i * 0.1}s both`,
                                    '@keyframes slideInUp': {
                                        'from': { opacity: 0, transform: 'translateY(20px)' },
                                        'to': { opacity: 1, transform: 'translateY(0)' },
                                    },
                                    boxShadow: '0 16px 35px rgba(15, 23, 42, 0.08)',
                                    '&:hover': {
                                        borderColor: '#93c5fd',
                                        boxShadow: '0 26px 60px rgba(14, 165, 233, 0.12)',
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            color: '#00D9FF',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Meeting Code
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '1.2rem',
                                            color: '#0f172a',
                                            fontWeight: 500,
                                            marginBottom: '1rem',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {meeting.meetingCode}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            color: '#64748b',
                                            fontWeight: 400,
                                        }}
                                    >
                                        📅 {formatDate(meeting.date)}
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => routeTo(`/${meeting.meetingCode}`)}
                                        sx={{
                                            color: '#00D9FF',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: '#00F5FF',
                                                backgroundColor: 'rgba(0, 217, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        Rejoin
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{
                        textAlign: 'center',
                        paddingY: '4rem',
                    }}>
                        <Typography sx={{
                            fontSize: '1.3rem',
                            color: '#475569',
                            fontWeight: 300,
                        }}>
                            No meeting history found
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.95rem',
                            color: '#64748b',
                            marginTop: '1rem',
                        }}>
                            Start your first meeting to see history here
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    )
}
