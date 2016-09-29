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

    this.peers = {};
    this.localStream = null;

    this.RTC = new RTCInterfaces();

    this.connection.on(EventsChat.getNewPeers, this.handleNewPeers);
    this.connection.on(EventsChat.webRTCMessage, this.handleWebRTCMessage);
  }

  /*
   Необходимо принять участников разговора от сервера,
   сохранить их на стороне клиента и вызвать каждого, обменявшись WebRTC-сообщениями.
   Ожидаем, что получаем массив с именами всех подключаемых к разговору
  */
  handleNewPeers = (peers) => {
    function peersToMap(arrayPeers) {
      let peersMap = {};
      for (let i = 0; i < arrayPeers.length; ++i) {
        peersMap[arrayPeers[i]] = null;
      }
      return peersMap;
    }

    this.peers = peersToMap(JSON.parse(peers));

    for (let side in this.peers) {
      this.createPeerConnection(side);
    }
  };

  handleWebRTCMessage = (message) => {
    const data = JSON.parse(message);
    let curSide = data.side;
    if (!this.peers[curSide]) {
      this.peers.push(curSide);
      this.createPeerConnection(curSide);
    }
    switch (data.type) {
      case 'offer':
        this.peers[curSide].connection
          .setRemoteDescription(new this.RTC.SessionDescription(data.desc))
          .then(() => {
            this._sendAnswer();
          })
          .catch(this._logError);
        break;
      case 'answer':
        this.peers[curSide].connection
          .setRemoteDescription(new this.RTC.SessionDescription(data.desc))
          .catch(this._logError);
        break;
      case 'candidate':
        this.peers[curSide].connection
          .addIceCandidate(new this.RTC.ICECandidate(data.candidate))
          .catch(this._logError);
        break;
      default:
        break;
    }
  };

  createPeerConnection = (side) => {
    const server = P2PController.contactServer;
    try {
      this.peers[side].connection = new this.RTC.PeerConnection(server);
      this.peers[side].connection
        .onicecandidate = this._handleIceCandidate.bind(this, side);
      this.peers[side].connection
        .onnegotiationneeded = this._handleNegotiationNeeded.bind(this, side);
      this.peers[side].connection
        .onaddstream = this._handleStream.bind(this, side);

      if (this.localStream.getVideoTracks().length > 0)
        this.peers[side].connection.addStream(this.localStream);

      console.log('Created local RTCPeerConnection for ' + side);
    } catch (err) {
      this._logError(err);
    }
  };

  setLocalStream(stream) {
    this.localStream = (stream) ? stream : null;
  }

  closeClientConnections = () => {
    for (let side in this.peers) {
      let curSideDoc = this.peers[side];
      if (curSideDoc.remoteStream) {
        if (curSideDoc.remoteStream.getVideoTracks()[0]) {
          curSideDoc.remoteStream.getVideoTracks()[0].stop();
        }
        if (curSideDoc.remoteStream.getAudioTracks()[0]) {
          curSideDoc.remoteStream.getAudioTracks()[0].stop();
        }
      }
      if (curSideDoc.connection) curSideDoc.connection.close();
    }
    this.peers = {};
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

  _sendAnswer(side) {
    this.peers[side].createAnswer()
      .then((answer) => {
        return this.peers[side].connection.setLocalDescription(answer);
      })
      .then(() => {
        const message = {
          type: 'answer',
          desc: this.peers[side].connection.localDescription,
          side
        };
        this._emitSignalingMessage(message);
      })
      .catch(this._logError)
  };

  _emitSignalingMessage = (message) => {
    console.log('Client sending message: ', message);
    this.connection.emit(EventsChat.emitWebRTCMessage, JSON.stringify(message));
  };

  _handleIceCandidate = (side, evt) => {
    console.log('icecandidate event: ', evt);
    if (evt.candidate) {
      const message = {
        type: 'candidate',
        candidate: evt.candidate,
        side
      };
      this._emitSignalingMessage(message);
    } else {
      console.log('End of candidates.');
    }
  };

  _handleNegotiationNeeded = (side) => {
    let connection = this.peers[side].connection;
    connection.createOffer()
      .then((offer) => {
        return connection.setLocalDescription(offer);
      })
      .then(() => {
        const message = {
          type: 'offer',
          desc: connection.localDescription,
          side
        };
        this._emitSignalingMessage(message);
      })
      .catch(this._logError);
  };

  _handleStream = (side, evt) => {
    console.log('Remote stream added:', evt);
    this.peers[side].remoteStream = evt.stream;
    let videoArea = document.getElementById(side.toLowerCase() + '-signal');
    videoArea.srcObject = this.peers[side].remoteStream;
    videoArea.onloadedmetadata = () => {
      videoArea.play();
    };
  };

  _logError(error) {
    console.log(error.name + ": " + error.message);
  };
}

export default P2PController;
