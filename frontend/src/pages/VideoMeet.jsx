import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import server from '../environment';

const server_url = server;
var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

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
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState('');
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState('');
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();
  }, []);

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
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
    }
  }, [video, audio]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal',
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    'signal',
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal',
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        'signal',
                        fromId,
                        JSON.stringify({ sdp: connections[fromId].localDescription })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                'signal',
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find((video) => video.socketId === socketListId);

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    'signal',
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = '/';
  };

  let toggleChat = () => {
    if (!showModal) {
      setNewMessages(0);
    }
    setModal(!showModal);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  let connect = (e) => {
    e?.preventDefault();
    if (!username.trim()) return;
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className="min-vh-100 position-relative overflow-hidden d-flex flex-column">
      {askForUsername ? (
        /* LOBBY VIEW */
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="card border-secondary p-4 shadow-lg w-100" style={{ maxWidth: '500px' }}>
            <h2 className="text-center fw-bold mb-4">Video Call</h2>
            
            <div className="position-relative rounded overflow-hidden bg-black mb-4 d-flex align-items-center justify-content-center" style={{ minHeight: '260px' }}>
              <video
                ref={localVideoref}
                autoPlay
                muted
                className="w-100 h-100 object-fit-cover"
                style={{ maxHeight: '300px' }}
              ></video>
            </div>

            <form onSubmit={connect}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="usernameInput"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="usernameInput" className="text-muted">Username</label>
              </div>

              <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold">Connect</button>
            </form>
          </div>
        </div>
      ) : (
        /* MAIN VIDEO CONFERENCE VIEW */
        <div className="d-flex flex-grow-1 position-relative">
          {/* Main Videos Grid Area */}
          <div className="flex-grow-1 p-3 pb-5 mb-5 overflow-auto">
            <div className="row g-3 justify-content-center align-items-center h-100">
              {/* Local User Video */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card bg-black border-secondary position-relative overflow-hidden shadow-sm" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={localVideoref}
                    autoPlay
                    muted
                    className="w-100 h-100 object-fit-cover"
                  ></video>
                  <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75">
                    You ({username})
                  </span>
                </div>
              </div>

              {/* Remote Participant Videos */}
              {videos.map((video) => (
                <div key={video.socketId} className="col-12 col-md-6 col-lg-4">
                  <div className="card bg-black border-secondary position-relative overflow-hidden shadow-sm" style={{ aspectRatio: '16/9' }}>
                    <video
                      data-socket={video.socketId}
                      ref={(ref) => {
                        if (ref && video.stream) {
                          ref.srcObject = video.stream;
                        }
                      }}
                      autoPlay
                      playsInline
                      className="w-100 h-100 object-fit-cover"
                    ></video>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Chat Modal Sidebar */}
          {showModal && (
            <div
              className="position-fixed end-0 top-0 h-100 bg-dark border-start border-secondary shadow-lg d-flex flex-column"
              style={{ width: '350px', zIndex: 1040, maxWidth: '100vw' }}
            >
              <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Chat</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={toggleChat}
                ></button>
              </div>

              <div className="flex-grow-1 p-3 overflow-auto">
                {messages.length !== 0 ? (
                  messages.map((item, index) => (
                    <div key={index} className="mb-3 p-2 rounded bg-secondary bg-opacity-20">
                      <p className="fw-bold text-warning mb-1 small">{item.sender}</p>
                      <p className="mb-0 text-break small">{item.data}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted mt-4 small">No Messages Yet</p>
                )}
              </div>

              <form onSubmit={sendMessage} className="p-3 border-top border-secondary d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm bg-secondary bg-opacity-20 text-white border-secondary"
                  placeholder="Enter message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-warning btn-sm text-white fw-semibold"
                  style={{ backgroundColor: '#FF9839', borderColor: '#FF9839' }}
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Floating Bottom Control Bar */}
          <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3 z-3">
            <div className="bg-dark bg-opacity-75 border border-secondary rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-lg backdrop-blur">
              {/* Toggle Video Button */}
              <button
                type="button"
                className={`btn btn-lg rounded-circle d-flex align-items-center justify-content-center ${video ? 'btn-outline-light' : 'btn-danger'}`}
                style={{ width: '48px', height: '48px' }}
                onClick={handleVideo}
                title={video ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {video ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .539-.365l3.111 1.382A1 1 0 0 0 16 12.469V5a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 4H4.213l6.748 8.365zM12.6 7.202l1.4-.622v2.84l-1.4-.622V7.202zM1.5 2.5a.5.5 0 0 0-.8.4v10.2a.5.5 0 0 0 .8.4l1.378-.827a.5.5 0 0 0 .222-.418V3.745a.5.5 0 0 0-.222-.418L1.5 2.5z"/>
                  </svg>
                )}
              </button>

              {/* End Call Button */}
              <button
                type="button"
                className="btn btn-danger btn-lg rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px' }}
                onClick={handleEndCall}
                title="End Call"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
                </svg>
              </button>

              {/* Toggle Audio Button */}
              <button
                type="button"
                className={`btn btn-lg rounded-circle d-flex align-items-center justify-content-center ${audio ? 'btn-outline-light' : 'btn-danger'}`}
                style={{ width: '48px', height: '48px' }}
                onClick={handleAudio}
                title={audio ? 'Mute Audio' : 'Unmute Audio'}
              >
                {audio ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.246 2.212-.67l.732.732A4.982 4.982 0 0 1 8 13c-2.485 0-4.5-1.802-4.95-4.2a.5.5 0 0 1 .99-.18C4.385 10.63 6.02 12 8 12z"/>
                  </svg>
                )}
              </button>

              {/* Toggle Screen Share */}
              {screenAvailable && (
                <button
                  type="button"
                  className={`btn btn-lg rounded-circle d-flex align-items-center justify-content-center ${screen ? 'btn-warning text-white' : 'btn-outline-light'}`}
                  style={{ width: '48px', height: '48px', backgroundColor: screen ? '#FF9839' : 'transparent' }}
                  onClick={handleScreen}
                  title={screen ? 'Stop Screen Share' : 'Share Screen'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v3z"/>
                  </svg>
                </button>
              )}

              {/* Chat Toggle Button with Badge */}
              <button
                type="button"
                className="btn btn-outline-light btn-lg rounded-circle position-relative d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px' }}
                onClick={toggleChat}
                title="Toggle Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                </svg>
                {newMessages > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {newMessages}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}