var events = {
  base: {
    connected: 'connection',
    disconnect: 'disconnect'
  },

  userData: {
    getUserData: "GET:USER:DATA",
    newUserData: "NEW:USER:DATA",

    getChangeUserPreferences: "EMIT:USER:PROPS:CHANGE:VALUES",
    sendSetUserPreferences: "GET:USER:PREFERENCE:VALUES"
  },

  adminAccount: {
    getCreateCtrlAccount: "EMIT:ADMIN:ACCOUNT:CREATE:VALUE",
    sendCreateCtrlAcc: "GET:CREATE:CONTROL:ACCOUNT",

    getRemoveCtrlAccount: "EMIT:REMOVE:CONTROL:ACCOUNT",
    sendRemoveCtrlAcc: "GET:REMOVE:CONTROL:ACCOUNT",

    getChangeCtrlPermissions: "EMIT:NEW:CTRL:PERMISSIONS",
    sendNewCtrlPermissions: "GET:NEW:USER:PERMISSIONS"
  },

  requests: {
    addRequestToUserSuccessful: "ADD:REQUEST:TO:USER",
    sendingRequestSuccessful: "SENDING:REQUEST:SUCCESSFUL",
    removeRequestFromUserSuccessful: "REMOVE:REQUEST:FROM:USER",
    getAddingRequest: "EMIT:USER:REQUEST",
    getRemovingRequest: "EMIT:REJECTION:REQUEST"
  },

  friends: {
    addFriendToUserSuccessful: "ADD:FRIEND:TO:USER",
    removeFriendFromUserSuccessful: "REMOVE:FRIEND:FROM:USER",
    getAddingFriend: "EMIT:RESOLUTION:REQUEST",
    getRemovingFriend: "EMIT:REMOVING:FRIEND"
  },

  search: {
    changeSearchedPeople: "NEW:SEARCH_PEOPLE:PEOPLE",
    changePatternSearchPeople: "EMIT:SEARCH:PEOPLE:INPUT:CHANGE"
  },

  conference: {
    callerAddToConference: "EMIT:ADDED:SIDE",
    sideChangeConference: "ADD:SIDES:TO:CONFERENCE",
    sideLeaveConference: "REMOVE:SIDE:FROM:CONFERENCE",
    callerCloseConference: "EMIT:CLOSE:CONFERENCE",
    closeConference: "CLOSE:CONFERENCE",
    sideAlreadyCalled: "SIDE:ALREADY:CALLED",
    sideNotAvailable: "SIDE:NOT:AVAILABLE",
    sendNewPeers: "SEND:NEW:PEERS"
  },

  signaling: {
    handleWebRTCMessage: "WEB:RTC:MESSAGE",
    responseWebRTCMessage: "WEB:RTC:RESPONSE:MESSAGE"
  }
};

module.exports = Object.freeze(events);