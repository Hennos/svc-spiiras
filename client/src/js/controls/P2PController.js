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
    this.SessionDescription =
      window.RTCSessionDescription ||
      window.webkitRTCSessionDescription ||
      window.mozRTCSessionDescription;
    this.ICECandidate =
      window.RTCIceCandidate ||
      window.webkitRTCIceCandidate||
      window.mozRTCIceCandidate;
  }
}

class P2PController {
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
    if (!this.pcP2P) {
      this.createPeerConnection();
    }
    const data = JSON.parse(message);
    switch (data.type) {
      case 'offer':
        this.peers.push(data.side);
        this.pcP2P.setRemoteDescription(new this.RTC.SessionDescription(data.desc))
          .then(() => {
            this._sendAnswer();
          })
          .catch(this._logError);
        break;
      case 'answer':
        this.pcP2P.setRemoteDescription(new this.RTC.SessionDescription(data.desc))
          .catch(this._logError);
        break;
      case 'candidate':
        this.pcP2P.addIceCandidate(new this.RTC.ICECandidate(data.candidate));
        break;
      default:
        break;
    }
  };

  createPeerConnection = () => {
    const server = P2PController.contactServer;
    try {
      this.pcP2P = new this.RTC.PeerConnection(server);
      this.pcP2P.onicecandidate = this._handleIceCandidate.bind(this);
      this.pcP2P.onnegotiationneeded = this._handleNegotiationNeeded.bind(this);
      this.pcP2P.onaddstream = this._handleStream.bind(this);

      if (this.localStream.getVideoTracks().length > 0)
        this.pcP2P.addStream(this.localStream);

      console.log('Created RTCPeerConnection');
    } catch (err) {
      this._logError(err);
    }
  };

  setLocalStream(stream) {
    this.localStream = (stream) ? stream : null;
  }

  closeClientConnections = () => {
    if (this.pcP2P) {
      this.peers = null;
      this.pcP2P.close();
      this.pcP2P = null
    }
  };

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
          side: this.peers[0],
          desc: this.pcP2P.localDescription
        };
        this._emitSignalingMessage(message);
      })
      .catch(this._logError)
  };

  _emitSignalingMessage = (message) => {
    console.log('Client sending message: ', message);
    this.connection.emit(EventsChat.emitWebRTCMessage, JSON.stringify(message));
  };

  _handleIceCandidate = (evt) => {
    console.log('icecandidate event: ', evt);
    if (evt.candidate) {
      const message = {
        type: 'candidate',
        side: this.peers[0],
        candidate: evt.candidate
      };
      this._emitSignalingMessage(message);
    } else {
      console.log('End of candidates.');
    }
  };

  _handleNegotiationNeeded = () => {
    this.pcP2P.createOffer()
      .then((offer) => {
        return this.pcP2P.setLocalDescription(offer);
      })
      .then(() => {
        const message = {
          type: 'offer',
          side: this.peers[0],
          desc: this.pcP2P.localDescription
        };
        this._emitSignalingMessage(message);
      })
      .catch(this._logError);
  };

  _handleStream = (evt) => {
    console.log('Remote stream added:', evt);
    this.remoteStream = evt.stream;
    let videoArea = document.getElementById(this.peers[0].toLowerCase() + '-signal');
    videoArea.srcObject = this.remoteStream;
    videoArea.onloadedmetadata = () => {
      videoArea.play();
    };
  };

  _logError(error) {
    console.log(error.name + ": " + error.message);
  };
}

export default P2PController;
