export const Events = {
  connected: 'connect',
  disconnected: 'disconnect',
  getUserData: "GET:USER:DATA",
  addFriendToUserOnServer: "ADD:FRIEND:TO:USER:SERVER",
  removeFriendFromUserOnServer: "REMOVE:FRIEND:FROM:USER:SERVER",
  addFriendToUserOnClient: "ADD:FRIEND:TO:USER:CLIENT",
  removeFriendFromUserOnClient: "REMOVE:FRIEND:FROM:USER:CLIENT",
  newUserData: "NEW:USER:DATA"
};

export const user = {
  username: 'username',
  friends: 'friends',
  place: 'place',
  firstName: 'firstName',
  image: 'image',
  lastName: 'lastName'
};

export const userRequests = {
  addingFriend: 'addingFriend',
  removingFriend: 'removingFriend'
};
