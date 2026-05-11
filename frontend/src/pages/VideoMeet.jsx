import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Box, Button as MuiButton } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        try {
            if (window.localStream) {
                const videoTracks = window.localStream.getVideoTracks();
                videoTracks.forEach(track => {
                    track.enabled = !video;
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    let handleAudio = () => {
        setAudio(!audio);
        try {
            if (window.localStream) {
                const audioTracks = window.localStream.getAudioTracks();
                audioTracks.forEach(track => {
                    track.enabled = !audio;
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        if (!message.trim()) {
            console.log('Message is empty');
            return;
        }
        
        if (!socketRef.current) {
            console.log('Socket not connected');
            return;
        }
        
        try {
            socketRef.current.emit('chat-message', message, username);
            setMessage("");
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>
            {askForUsername === true ? (
                <Box sx={{
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f8fbff 0%, #eef3f8 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    animation: 'fadeIn 0.6s ease',
                    '@keyframes fadeIn': {
                        'from': { opacity: 0 },
                        'to': { opacity: 1 },
                    },
                }}>
                    <Box sx={{
                        textAlign: 'center',
                        animation: 'slideInUp 0.6s ease',
                        '@keyframes slideInUp': {
                            'from': { opacity: 0, transform: 'translateY(20px)' },
                            'to': { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 300,
                            background: 'linear-gradient(45deg, #00D9FF, #00F5FF)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem',
                        }}>Enter into Lobby</h2>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                    }}>
                        <TextField
                            id="username-input"
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            variant="outlined"
                            sx={{
                                width: '250px',
                                '& .MuiOutlinedInput-root': {
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
                                },
                            }}
                        />
                        <MuiButton
                            variant="contained"
                            onClick={connect}
                            sx={{
                                background: 'linear-gradient(135deg, #00D9FF, #00F5FF)',
                                color: '#0F0F0F',
                                fontWeight: 600,
                                padding: '0.7rem 2rem',
                                textTransform: 'none',
                                borderRadius: '30px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 30px rgba(0, 217, 255, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Connect
                        </MuiButton>
                    </Box>

                    <Box sx={{
                        width: '400px',
                        height: '300px',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                        animation: 'scaleIn 0.6s ease',
                        '@keyframes scaleIn': {
                            'from': { opacity: 0, transform: 'scale(0.95)' },
                            'to': { opacity: 1, transform: 'scale(1)' },
                        },
                    }}>
                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        ></video>
                    </Box>
                </Box>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {showModal ? (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <h1 style={{
                                    background: 'linear-gradient(45deg, #00D9FF, #00F5FF)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: '1.5rem',
                                    fontWeight: 300,
                                    letterSpacing: '1px',
                                }}>Messages</h1>

                                <div className={styles.chattingDisplay} style={{
                                    height: '70%',
                                    overflowY: 'auto',
                                    paddingRight: '8px',
                                    marginBottom: '1rem',
                                    borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
                                }}>
                                    {messages.length !== 0 ? (
                                        messages.map((item, index) => (
                                            <div key={index} style={{
                                                marginBottom: "12px",
                                                padding: '0.8rem',
                                                background: 'rgba(0, 217, 255, 0.05)',
                                                borderRadius: '8px',
                                                borderLeft: '3px solid #00D9FF',
                                                animation: 'slideInUp 0.3s ease',
                                            }}>
                                                <p style={{
                                                    fontWeight: "600",
                                                    color: '#00D9FF',
                                                    marginBottom: '0.3rem',
                                                    fontSize: '0.85rem',
                                                }}>
                                                    {item.sender}
                                                </p>
                                                <p style={{
                                                    color: '#0f172a',
                                                    fontSize: '0.9rem',
                                                    margin: 0,
                                                    wordWrap: 'break-word',
                                                }}>
                                                    {item.data}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#64748b', textAlign: 'center' }}>No messages yet</p>
                                    )}
                                </div>

                                <div className={styles.chattingArea} style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    position: 'relative',
                                    zIndex: 10,
                                }}>
                                    <TextField
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                sendMessage();
                                            }
                                        }}
                                        id="chat-input"
                                        placeholder="Enter your message"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#cbd5e1',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#93c5fd',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#0ea5e9',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#0f172a',
                                            },
                                        }}
                                    />
                                    <MuiButton
                                        variant='contained'
                                        onClick={sendMessage}
                                        sx={{
                                            background: 'linear-gradient(135deg, #00D9FF, #00F5FF)',
                                            color: '#0F0F0F',
                                            fontWeight: 600,
                                            minWidth: '70px',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Send
                                    </MuiButton>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className={styles.buttonContainers}>
                        <IconButton
                            onClick={handleVideo}
                            sx={{
                                color: video ? '#00D9FF' : '#FF6B6B',
                                fontSize: '2.5rem',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.15)',
                                    textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
                                },
                            }}
                        >
                            {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton
                            onClick={handleEndCall}
                            sx={{
                                color: '#FF6B6B',
                                fontSize: '2.5rem',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.15)',
                                    boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
                                },
                            }}
                        >
                            <CallEndIcon />
                        </IconButton>

                        <IconButton
                            onClick={handleAudio}
                            sx={{
                                color: audio ? '#00D9FF' : '#FF6B6B',
                                fontSize: '2.5rem',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.15)',
                                    textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
                                },
                            }}
                        >
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true && (
                            <IconButton
                                onClick={handleScreen}
                                sx={{
                                    color: screen ? '#FFD700' : '#00D9FF',
                                    fontSize: '2.5rem',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                        textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
                                    },
                                }}
                            >
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={999} sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#FF6B6B',
                                color: '#FFFFFF',
                            },
                        }}>
                            <IconButton
                                onClick={() => setModal(!showModal)}
                                sx={{
                                    color: showModal ? '#00D9FF' : '#B0B0B0',
                                    fontSize: '2.5rem',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                        textShadow: '0 0 20px rgba(0, 217, 255, 0.6)',
                                    },
                                }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    <video
                        className={styles.meetUserVideo}
                        ref={localVideoref}
                        autoPlay
                        muted
                    ></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                ></video>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
