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

  userChangePreferenсes: "EMIT:USER_PROPS_CHANGE:VALUE",
  userSetPreferences: "GET:USER_PROPS_CHANGE:VALUE",
  userPreferencesSetValue: "SET:USER_PROPS:VALUE"
};

export const user = {
  admined: "admined",
  username: 'username',
  requests: 'requests',
  friends: 'friends',
  image: 'image',
  status: {
    id: 'status',
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
  }
};
