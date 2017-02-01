export const Events = {
  addSides: 'ADD:SIDES:TO:CONFERENCE',
  removeSide: 'REMOVE:SIDE:FROM:CONFERENCE',
  closeConference: 'CLOSE:CONFERENCE',
  openedConference: 'OPENED:CONFERENCE',
  getUserStreamURL: 'USER:STREAM:URL',
  webRTCMessage: 'WEB:RTC:RESPONSE:MESSAGE',
  emitWebRTCMessage: 'WEB:RTC:MESSAGE',
  getNewPeers: "SEND:NEW:PEERS",
  emitAddedSide: 'EMIT:ADDED:SIDE',
  emitCloseConference: 'EMIT:CLOSE:CONFERENCE'
};

export const Chat = {
  sides: 'sides',
  url: 'url',
  isConferenceOpen: 'conference'
};
