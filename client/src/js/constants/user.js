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
  removeFriendFromUser: "REMOVE:FRIEND:FROM:USER"
};

export const user = {
  username: 'username',
  requests: 'requests',
  friends: 'friends',
  place: 'place',
  firstName: 'firstName',
  image: 'image',
  lastName: 'lastName'
};
