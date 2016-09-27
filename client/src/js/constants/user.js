export const Events = {
  connected: 'connect',
  disconnected: 'disconnect',

  getUserData: "GET:USER:DATA",
  newUserData: "NEW:USER:DATA",

  addRequestToUser: "ADD:REQUEST:TO:USER",
  emitUserRequest: "EMIT:USER:REQUEST",
  removeRequestFromUser: "REMOVE:REQUEST:FROM:USER",
  emitRemovingRequest: "EMIT:REMOVING:REQUEST",

  addFriendToUser: "ADD:FRIEND:TO:USER",
  emitAddingFriend: "EMIT:ADDING:FRIEND",
  removeFriendFromUser: "REMOVE:FRIEND:FROM:USER",
  emitRemovingFriend: "EMIT:REMOVING:FRIEND"
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
