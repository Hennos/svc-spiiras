var fields = {
  admin: {
    admined: 'admined'
  },
  user: {
    admin: 'admin',
    username: 'username',
    requests: 'requests',
    friends: 'friends',
    image: 'image',
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
    },
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
    }
  }
};

module.exports = Object.freeze(fields);