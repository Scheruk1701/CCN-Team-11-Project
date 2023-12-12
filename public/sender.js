// Establish a connection with the signaling server
const socket = io();
let peerConnection;
const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
let dataChannel;

// Image sequence configuration
let imageIndex = 1; // Start from the first image
const totalImages = 100; // Total number of images in the sequence
const frameRate = 10; // Frames per second

// Start the WebRTC and image sequence
setupWebRTC();
startImageSequence();

function setupWebRTC() {
    // Create a new RTCPeerConnection
    peerConnection = new RTCPeerConnection(configuration);

    // Create a data channel
    dataChannel = peerConnection.createDataChannel("frames");

    // Set up handlers for the ICE candidates
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            socket.emit('signal', { 'candidate': event.candidate });
        }
    };

    // Handle the creation of the offer
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('signal', { 'offer': peerConnection.localDescription });
        });

    // Listen for signals from the signaling server
    socket.on('signal', data => {
        if (data.answer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });
}

function startImageSequence() {
    setInterval(() => {
        sendImage(`/output_images/frame${imageIndex}.png`);
        displayImage(`/input_images/frame${imageIndex}.png`);
        imageIndex = (imageIndex + 1) % 40;
    }, 1000 / frameRate);
}

function displayImage(imageUrl) {
    // Assuming you have an <img> element with id 'localImage'
    const imageElement = document.getElementById('localImage');
    imageElement.src = imageUrl;
}

function sendImage(imageUrl) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => blob.arrayBuffer())
        .then(arrayBuffer => {
            if (dataChannel.readyState === 'open') {
                dataChannel.send(arrayBuffer);
            }
        })
        .catch(error => console.error('Error sending image:', error));
}
