export const Events = {
  connected: 'connect',
  disconnected: 'disconnect',

  getUserData: "GET:USER:DATA",
  newUserData: "NEW:USER:DATA",

  emitUserRequest: "EMIT:USER:REQUEST",
  addRequestToUser: "ADD:REQUEST:TO:USER",
  emitRejectionRequest: "EMIT:REJECTION:REQUEST",
  removeRequestFromUser: "REMOVE:REQUEST:FROM:USER",
  emitResolutionRequest: "EMIT:RESOLUTION:REQUEST",

  addFriendToUser: "ADD:FRIEND:TO:USER",
  emitRemovingFriend: "EMIT:REMOVING:FRIEND",
  removeFriendFromUser: "REMOVE:FRIEND:FROM:USER",

  emitChangePreferences: "EMIT:USER:PROPS:CHANGE:VALUES",
  getChangePreferences: "GET:USER:PREFERENCE:VALUES",

  getUserUpdate: "GET:USER:UPDATE"
};

export const user = {
  admin: "admin",
  username: 'username',
  requests: 'requests',
  friends: 'friends',
  image: 'image',
  preferences: {
    id: 'preferences',
    fields: {
      firstName: 'firstName',
      lastName: 'lastName',
      middleName: 'middleName',
      country: 'country',
      university: 'university',
      school: 'school',
      workplace: 'workplace',
      place: 'place'
    }
  },
  permission: {
    id: 'permission',
    fields: {
      makeCalls: 'makeCalls',
      addingFriends: 'addingFriends',
      forcedCall: "forcedCall",
      interactiveBoard: "interactiveBoard",
      passwordExitProfile: 'passwordExitProfile',
      passwordManipulationOfAudioVideo: 'passwordManipulationOfAudioVideo'
    }
  }
};
