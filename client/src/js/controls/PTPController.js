import {Events as EventsChat} from '../constants/chat'

class RTCInterfaces {
  constructor() {
    this.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.getUserMedia;
    this.PeerConnection =
      window.RTCPeerConnection ||
      window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection;
  }
}

class PtPController {
  constructor(connection) {
    this.connection = connection;

    this.pcP2P = null;
    this.peers = [];
    this.localStream = null;
    this.remoteStream = null;

    this.RTC = new RTCInterfaces();

    this.connection.on(EventsChat.getNewPeers, this.handleNewPeers);
    this.connection.on(EventsChat.webRTCMessage, this.handleWebRTCMessage);
  }

  handleNewPeers = (peers) => {
    this.peers = JSON.parse(peers);
    this.createPeerConnection();
  };

  handleWebRTCMessage = (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'offer':
        this.peers.push(data.side);
        this.pcP2P.setRemoteDescription(data.desc)
          .then(() => {
            this._sendAnswer();
          })
          .catch(this._logError);
        break;
      case 'answer':
        this.pcP2P.setRemoteDescription(data.desc);
        break;
      case 'candidate':
        this.pcP2P.addIceCandidate(data.candidate);
        break;
      default:
        break;
    }
  };

  createPeerConnection() {
    const server = PtPController.contactServer;
    try {
      this.pcP2P = new this.RTC.PeerConnection(server);
      this.pcP2P.onicecandidate = this._handleIceCandidate;
      this.pcP2P.onnegotiationneeded = this._handleNegotiationNeeded;
      this.pcP2P.ontrack = this._handleTrack;

      if (this.localStream.getAudioTracks().length > 0)
        this.pcP2P.addTrack(this.localStream.getAudioTracks()[0], this.localStream);
      if (this.localStream.getVideoTracks().length > 0)
        this.pcP2P.addTrack(this.localStream.getVideoTracks()[0], this.localStream);

      console.log('Created RTCPeerConnection');
    } catch (err) {
      this._logError(err);
    }
  };

  setLocalStream(stream) {
    this.localStream = (stream) ? stream : null;
    console.dir(this.localStream);
  }

  closeClientConnections() {
    this.pcP2P.close();
  }

  static get contactServer() {
    return {
      iceServers: [
        {url: 'stun:stun01.sipphone.com'},
        {url: 'stun:stun.ekiga.net'},
        {url: 'stun:stun.fwdnet.net'},
        {url: 'stun:stun.ideasip.com'},
        {url: 'stun:stun.iptel.org'},
        {url: 'stun:stun.rixtelecom.se'},
        {url: 'stun:stun.schlund.de'},
        {url: 'stun:stun.l.google.com:19302'},
        {url: 'stun:stun1.l.google.com:19302'},
        {url: 'stun:stun2.l.google.com:19302'},
        {url: 'stun:stun3.l.google.com:19302'},
        {url: 'stun:stun4.l.google.com:19302'},
        {url: 'stun:stunserver.org'},
        {url: 'stun:stun.softjoys.com'},
        {url: 'stun:stun.voiparound.com'},
        {url: 'stun:stun.voipbuster.com'},
        {url: 'stun:stun.voipstunt.com'},
        {url: 'stun:stun.voxgratia.org'},
        {url: 'stun:stun.xten.com'},
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        },
        {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        },
        {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        }
      ]
    };
  }

  _sendAnswer() {
    this.pcP2P.createAnswer()
      .then((answer) => {
        return this.pcP2P.setLocalDescription(answer);
      })
      .then(() => {
        const message = {
          type: 'answer',
          side: this.peers[0].username,
          desc: this.pcP2P.localDescription
        };
        this._emitSignalingMessage(message);
      })
  };

  _emitSignalingMessage(message) {
    console.log('Client sending message: ', message);
    this.connection.emit(EventsChat.emitWebRTCMessage, message);
  };

  _handleIceCandidate(evt) {
    console.log('icecandidate event: ', evt);
    if (evt.candidate) {
      const message = {
        type: 'candidate',
        side: this.peers[0].username,
        candidate: evt.candidate
      };
      this._emitSignalingMessage(message);
    } else {
      console.log('End of candidates.');
    }
  };

  _handleNegotiationNeeded() {
    this.pcP2P.createOffer()
      .then((offer) => {
        return this.pcP2P.setLocalDescription(offer);
      })
      .then(() => {
        const message = {
          type: 'offer',
          side: this.peers[0].username,
          desc: this.pcP2P.localDescription
        };
        this._emitSignalingMessage(message);
      })
      .catch(this._logError);
  };

  _handleTrack = (evt) => {
    console.log('Remote track added:', evt);
    if (evt.track.kind === 'video') {
      let videoArea = document.getElementById(this.peers[0].username.toLowerCase + '-signal');
      videoArea.src = evt.streams[0];
      videoArea.onloadedmetadata = () => {
        videoArea.play();
      };
    }
  };

  _logError(error) {
    log(error.name + ": " + error.message);
  };
}

export default PtPController;
