import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

// Light theme configuration
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f8fbff',
            paper: '#ffffff',
        },
        primary: {
            main: '#0ea5e9',
        },
        secondary: {
            main: '#38bdf8',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        },
        error: {
            main: '#ef4444',
        },
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto"',
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.5px',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#cbd5e1',
                        },
                        '&:hover fieldset': {
                            borderColor: '#93c5fd',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#0ea5e9',
                            boxShadow: '0 0 10px rgba(14, 165, 233, 0.18)',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#0f172a',
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#64748b',
                        opacity: 1,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                    color: '#ffffff',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
                        boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
                    },
                },
                outlined: {
                    borderColor: '#bfdbfe',
                    color: '#0f172a',
                    '&:hover': {
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    backgroundImage: 'none',
                    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
                },
            },
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false)

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password)
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {
            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Grid container component="main" sx={{ height: '100vh', background: 'linear-gradient(135deg, #f8fbff 0%, #eef3f8 100%)' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent)',
                        },
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={0}
                    square
                    sx={{
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeft: '1px solid rgba(148, 163, 184, 0.18)',
                    }}
                >
                    <Box
                        sx={{
                            my: { xs: 3, sm: 6, md: 8 },
                            mx: { xs: 2, sm: 3, md: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            animation: 'fadeInUp 0.6s ease',
                            '@keyframes fadeInUp': {
                                'from': { opacity: 0, transform: 'translateY(20px)' },
                                'to': { opacity: 1, transform: 'translateY(0)' },
                            },
                            width: { xs: '100%', sm: '100%' },
                            maxWidth: '400px',
                        }}
                    >
                        <Avatar sx={{
                            m: 1,
                            background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                            width: { xs: 40, sm: 48, md: 56 },
                            height: { xs: 40, sm: 48, md: 56 },
                            boxShadow: '0 0 20px rgba(14, 165, 233, 0.2)',
                        }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography variant="h4" sx={{
                            mb: 3,
                            fontWeight: 300,
                            letterSpacing: '1px',
                            background: 'linear-gradient(45deg, #0ea5e9, #22d3ee)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        }}>
                            {formState === 0 ? 'Welcome Back' : 'Join Us'}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: { xs: 1, sm: 2, md: 2 },
                            mb: 3,
                            width: '100%',
                            '& button': {
                                flex: 1,
                                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                            },
                        }}>
                            <Button
                                variant={formState === 0 ? "contained" : "outlined"}
                                onClick={() => { setFormState(0) }}
                                sx={{
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant={formState === 1 ? "contained" : "outlined"}
                                onClick={() => { setFormState(1) }}
                                sx={{
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullname"
                                label="Full Name"
                                name="fullname"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                sx={{ mb: 2 }}
                            /> : <></>}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                sx={{ mb: 2 }}
                            />

                            {error && <Typography sx={{ color: '#FF6B6B', mb: 2, fontSize: '0.9rem' }}>{error}</Typography>}

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleAuth}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {formState === 0 ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                message={message}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        background: 'linear-gradient(135deg, #00D9FF, #00F5FF)',
                        color: '#0F0F0F',
                    },
                }}
            />
        </ThemeProvider>
    );
}
