import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsChat} from '../constants/chat'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties, addedUserFriend, removedUserFriend} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {
  addSidesToConference,
  removeSideFromConference,
  closeConference,
  getUserStreamURL
} from '../actions/chat'

import PtPController from './PtPController'

let PeerConnection =
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection;
let SessionDescription =
  window.mozRTCSessionDescription ||
  window.RTCSessionDescription;
let IceCandidate =
  window.mozRTCIceCandidate ||
  window.RTCIceCandidate;

class Root {
  constructor() {
    this.searchPeopleInput = '';
    this.pc = null;
    this.peers = [];
    this.localStream = null;
  }

  setConnection = (address, store) => {
    this.store = store;
    this.connection = io(address, {reconnection: false});

    this.connection.on(EventsUser.connected, this.afterConnection);
    this.connection.on(EventsUser.disconnected, this.afterDisconnection);
    this.connection.on(EventsUser.newUserData, this.newUserData);
    this.connection.on(EventsUser.addFriendToUser, this.updateUserAfterAddingFriend);
    this.connection.on(EventsUser.removeFriendFromUser, this.updateUserAfterRemovingFriend);
    this.connection.on(EventsPeople.changeSearchedPeople, this.updateSearchedPeople);
    this.connection.on(EventsChat.addSides, this.pushSidesToConference);
    this.connection.on(EventsChat.removeSide, this.eraseSideFromConference);
    this.connection.on(EventsChat.webRTCMessage, this.handleWebRTCMessage);
    this.connection.on(EventsChat.getNewPeers, this.getNewPeers);
  };

  changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
    switch (action.type) {
      case EventsPeople.emitSearchPeopleInputChange:
        this.emitChangeInputValueEvent(action.type, action.value);
        break;
      case EventsUser.emitAddingFriend:
        this.emitFriendsEvent(action.type, action.friend);
        break;
      case EventsUser.emitRemovingFriend:
        this.emitFriendsEvent(action.type, action.friend);
        break;
      case EventsChat.emitAddedSide:
        this.emitAddedSide(action.type, action.side);
        break;
      case EventsChat.emitCloseConference:
        this.emitCloseConferenceEvent(action.type);
        break;
    }
    return next(action);
  };

  afterConnection = () => {
    console.log('connected');
    this.getUserData();
  };

  afterDisconnection = () => {
    this.store.dispatch(closeConference());
    if (this.pc) {
      this.pc.close();
      this.pc = null;
      if (this.localStream) {
        this.localStream.getVideoTracks()[0].stop();
        this.localStream = null;
      }
    }
    console.log('disconnect')
  };

  newUserData = (user) => {
    this.store.dispatch(setUserProperties(JSON.parse(user)));
  };

  getUserData = () => {
    this.connection.emit(EventsUser.getUserData);
  };

  updateUserAfterAddingFriend = (friend) => {
    this.store.dispatch(addedUserFriend(friend));
    this.emitChangeInputValueEvent(EventsPeople.emitSearchPeopleInputChange, this.searchPeopleInput);
  };

  updateUserAfterRemovingFriend = (friend) => {
    this.store.dispatch(removedUserFriend(friend));
    this.emitChangeInputValueEvent(EventsPeople.emitSearchPeopleInputChange, this.searchPeopleInput);
  };

  updateSearchedPeople = (people) => {
    this.store.dispatch(newSearchedPeople(JSON.parse(people)));
  };

  pushSidesToConference = (sides) => {
    this.store.dispatch(addSidesToConference(JSON.parse(sides)));
  };

  eraseSideFromConference = (sideName) => {
    this.store.dispatch(removeSideFromConference(sideName));
  };

  getNewPeers = (peers) => {
    this.peers = JSON.parse(peers);
    this._createPeerConnection();
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      })
      .then((stream) => {
        this._gotStream(stream);
        this.pc.addStream(stream);
        this.emitWebRTCMessage({
          side: this.peers[0].username,
          type: 'got user media'
        });
        this._doCall();
      })
      .catch((e) => {
        alert('getUserMedia() error: ' + e.name);
      });
  };

  handleWebRTCMessage = (message) => {
    const json = JSON.parse(message);
    switch (json.type) {
      case 'got user media':
        this._createPeerConnection();
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          })
          .then((stream) => {
            this._gotStream(stream);
            this.pc.addStream(stream);
          })
          .catch((e) => {
            alert('getUserMedia() error: ' + e.name);
          });
        break;
      case 'offer':
        this.peers.push(json.side);
        this.pc.setRemoteDescription(new SessionDescription(json));
        this._doAnswer();
        break;
      case 'answer':
        this.pc.setRemoteDescription(new SessionDescription(json));
        break;
      case 'candidate':
        let candidate = new IceCandidate({
          sdpMLineIndex: json.label,
          candidate: json.candidate
        });
        this.pc.addIceCandidate(candidate);
        break;
      default:
        break;
    }
  };

  emitChangeInputValueEvent = (type, value) => {
    this.connection.emit(type, JSON.stringify(value));
    this.searchPeopleInput = value;
  };

  emitFriendsEvent = (type, friendName) => {
    this.connection.emit(type, JSON.stringify(friendName));
  };

  emitAddedSide = (type, sideName) => {
    this.connection.emit(type, sideName);
  };

  emitCloseConferenceEvent = (type) => {
    this.store.dispatch(closeConference());
    this.connection.emit(type);
  };

  emitWebRTCMessage = (message) => {
    console.log('Client sending message: ', message);
    this.connection.emit(EventsChat.emitWebRTCMessage, JSON.stringify(message));
  };

  _gotStream = (stream) => {
    console.log('Adding local stream.');
    stream.onended = () => console.log('Stream ended');
    this.localStream = stream;
  };

  _createPeerConnection = () => {
    const server = {
      iceServers: [
        {url:'stun:stun01.sipphone.com'},
        {url:'stun:stun.ekiga.net'},
        {url:'stun:stun.fwdnet.net'},
        {url:'stun:stun.ideasip.com'},
        {url:'stun:stun.iptel.org'},
        {url:'stun:stun.rixtelecom.se'},
        {url:'stun:stun.schlund.de'},
        {url:'stun:stun.l.google.com:19302'},
        {url:'stun:stun1.l.google.com:19302'},
        {url:'stun:stun2.l.google.com:19302'},
        {url:'stun:stun3.l.google.com:19302'},
        {url:'stun:stun4.l.google.com:19302'},
        {url:'stun:stunserver.org'},
        {url:'stun:stun.softjoys.com'},
        {url:'stun:stun.voiparound.com'},
        {url:'stun:stun.voipbuster.com'},
        {url:'stun:stun.voipstunt.com'},
        {url:'stun:stun.voxgratia.org'},
        {url:'stun:stun.xten.com'},
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
    const options = {
      optional: [
        {DtlsSrtpKeyAgreement: true}, // требуется для соединения между Chrome и Firefox
        {RtpDataChannels: true} // требуется в Firefox для использования DataChannels API
      ]
    };

    try {
      this.pc = new PeerConnection(server, options);
      this.pc.onicecandidate = this._handleIceCandidate.bind(this);
      this.pc.onaddstream = this._handleRemoteStreamAdded.bind(this);
      this.pc.onremovestream = this._handleRemoteStreamRemoved.bind(this);
      console.log('Created RTCPeerConnnection');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  };

  _handleIceCandidate = (event) => {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
      this.emitWebRTCMessage({
        type: 'candidate',
        side: this.peers[0].username,
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of candidates.');
    }
  };

  _handleRemoteStreamAdded = (event) => {
    console.log('Remote stream added.');
    console.log(event);
    let videoArea = document.getElementById(this.peers[0].username.toLowerCase + '-signal');
    videoArea.src = window.URL.createObjectURL(event.stream);
    videoArea.onloadedmetadata = (e) => {
      videoArea.play();
    };
  };

  _handleRemoteStreamRemoved = (event) => {
    console.log('Remote stream removed. Event: ', event);
  };

  _handleCreateOfferError = (event) => {
    console.log('createOffer() error: ', event);
  };

  _doCall = () => {
    console.log('Sending offer to peer');
    this.pc.createOffer().then(
      this._setLocalAndSendMessage,
      this._handleCreateOfferError);
  };

  _doAnswer = () => {
    console.log('Sending answer to peer.');
    this.pc.createAnswer().then(
      this._setLocalAndSendMessage,
      this._onCreateSessionDescriptionError
    );
  };

  _setLocalAndSendMessage = (sessionDescription) => {
    this.pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    this.emitWebRTCMessage(sessionDescription);
  };

  _onCreateSessionDescriptionError = (error) => {
    trace('Failed to create session description: ' + error.toString());
  };
}

export default Root;
