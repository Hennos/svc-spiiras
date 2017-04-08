import {Events as EventsChat} from '../constants/chat'
import React from 'react';
import {connect} from 'react-redux';

import {_} from  'lodash';

import {openedConference, addStreamToSide, addVideoElementToSide, removedSideConference, closeConference} from '../actions/chat'

import {Parameters as CameraParametrs, Stream as CameraStream} from  '../constants/videoCamera';
import {RootIOConnection} from  '../constants/rootIO';
import {Chat} from  '../constants/chat';

class RTCInterfaces  {
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


class VideStreamsMixer {
  constructor(props) {
    this._canvasElementContext = document.createElement('canvas');
    this._canvasElementContext = this._canvasElement.getContext("2d");
  }
}

class P2PController extends React.Component{
  constructor(props) {
    super(props);
    this.connection = props.ioConnection;

    this.isInitiator = false;




    this.peers = {};

    this.RTC = new RTCInterfaces();

  }

  componentDidMount(prevProps, prevState){
    if(this.props.ioConnection){
      this.connection = this.props.ioConnection;
      this.connection.on(EventsChat.getNewPeers, this.handleNewPeers);
      this.connection.on(EventsChat.webRTCMessage, this.handleWebRTCMessage);
    }
  }

  componentDidUpdate(prevProps, prevState){

    if(this.props.removingSide)
      this._closeClientConnection(this.props.removingSide);

    if(!this.props.ioIsConnected
      || ((prevProps.isConferenceOpen != this.props.isConferenceOpen) && !this.props.isConferenceOpen)){
      this._closeClientsConnections();
    }
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
        peersMap[arrayPeers[i]] = {};
      }
      return peersMap;
    }

    this.isInitiator = true;

    this.peers = peersToMap(peers);

    for (let side in this.peers) {
      this.createPeerConnection(side);
    }
  };

  handleWebRTCMessage = (message) => {
    const data = JSON.parse(message);
    let curSide = data.side;
    if (!this.peers[curSide]) {
      this.peers[curSide] = {};
      this.createPeerConnection(curSide);
    }
    switch (data.type) {
      case 'offer':
        this.peers[curSide].connection
          .setRemoteDescription(new this.RTC.SessionDescription(data.desc))
          .then(() => {
            this._sendAnswer(curSide);
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
      this.peers[side].connection.
        ondatachannel= this._dataChannelOpened.bind(this, side);

      /*this.peers[side].
       dataChanel = this.peers[side].connection.createDataChannel(side);*/

      if (this.props.ioIsConnected
        && this.props.localStream
        && this.props.localStream.getVideoTracks().length > 0)
        this.peers[side].connection.addStream(this.props.localStream);

      console.log('Created local RTCPeerConnection for ' + side);
    } catch (err) {
      this._logError(err);
    }
  };


  _dataChannelOpened = (side) => {
    this.peers[side].dataChanel.onopen = () => {
      console.log(side + " datachannel open");

    };
    this.peers[side].dataChanel.onclose = this._closeClientConnection.bind(this, side);
  };



  _closeClientConnection = (side) =>{
      console.log(side + " connection closed");
      if (this.peers[side].connection)
        this.peers[side].connection.close();
      delete  this.peers[side];

      this.props.eraseSideFromConference(side);
  };


  _closeClientsConnections = () => {
    console.log('Close videoconferencing');

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

  _sendAnswer = (side) => {
    this.peers[side].connection.createAnswer()
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
    const data = JSON.stringify(message);
    this.connection.emit(EventsChat.emitWebRTCMessage, data);
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
    if (!this.isInitiator) return null;

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
    let videoArea;
    if(this.peers[side].videoElement){
      videoArea = this.peers[side].videoElement;
    } else {
      videoArea = document.createElement('video');
      videoArea.id = side.toLowerCase() + '-signal';
      videoArea.srcObject = this.peers[side].remoteStream;
      videoArea.autoPlay = true;
      this.peers[side].videoElement = videoArea;
      this.props.newVideoElementFromSide(side,  videoArea);

    }

    //let that = this;
    videoArea.onloadedmetadata = () => {
      this.props.newStreamFromSide(side, evt.stream);
      if(!this.props.isConferenceOpen){
        this.props.conferenceOpened();
      }
      videoArea.play();
    };
  };

  _logError(error) {
    console.log(error.name + ": " + error.message);
    throw error;
  };

  render(){return null;}
}


const mapDispatchP2PControllerProps = (dispatch) => {
  return {
    newVideoElementFromSide: (username, video) =>{
      dispatch(addVideoElementToSide(username, video));
    },
    newStreamFromSide: (username, stream) =>{
      dispatch(addStreamToSide(username, stream));
    },
    conferenceOpened: () =>{
      dispatch(openedConference())
    },
    eraseSideFromConference: (sideName) => {
      dispatch(removedSideConference(sideName))
    }

  };
};

const mapStateP2PControllerProps = (state, ownProps) => {
  return {
    cameraIsLoading: state.videoCameraComponent
      .get(CameraParametrs.isLoading),
    localStream: state.videoCameraComponent
      .get(CameraStream.localStream),
    ioConnection:state.rootIO
      .get(RootIOConnection.connection),
    ioIsConnected:state.rootIO
      .get(RootIOConnection.isConnected),
    isConferenceOpen:state.chat
      .get(Chat.isConferenceOpen),
    removingSide : state.chat
      .get(Chat.removingSide)
  };
};

export default connect(mapStateP2PControllerProps, mapDispatchP2PControllerProps)(P2PController);
