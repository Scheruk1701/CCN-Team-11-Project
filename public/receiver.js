// Establish a connection with the signaling server
const socket = io();
let peerConnection;
const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
let dataChannel;

// Start the WebRTC setup
setupWebRTC();

function setupWebRTC() {
    // Create a new RTCPeerConnection
    peerConnection = new RTCPeerConnection(configuration);

    // Set up handlers for the ICE candidates
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            socket.emit('signal', { 'candidate': event.candidate });
        }
    };

    // Listen for signals from the signaling server
    socket.on('signal', data => {
        if (data.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
                .then(() => peerConnection.createAnswer())
                .then(answer => peerConnection.setLocalDescription(answer))
                .then(() => {
                    socket.emit('signal', { 'answer': peerConnection.localDescription });
                });
        } else if (data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });

    // Setup the data channel event handlers
    peerConnection.ondatachannel = event => {
        dataChannel = event.channel;
        dataChannel.onopen = () => console.log("Data Channel is open");
        dataChannel.onmessage = receiveImageData;
    };
}

function receiveImageData(event) {
    const arrayBuffer = event.data;
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    displayImage(URL.createObjectURL(blob));
}


function displayImage(imageUrl) {
    const imageElement = document.getElementById('remoteImage');
    imageElement.src = imageUrl;
}
