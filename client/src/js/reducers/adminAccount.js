import Immutable from 'immutable';

import {Events} from '../constants/adminAccount'
import {adminAccount as adminFields} from '../constants/adminAccount'

import {state as initialState} from '../states/adminAccount'

const adminAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.getAdminStatus:
      return handleAdminStatus(state, action);
    case Events.getCreateCtrlAcc:
      return handleCreatedCtrlAcc(state, action);
    case Events.getRemoveCtrlAcc:
      return handleRemovedCtrlAcc(state, action);
    case Events.getUpdatedCtrlAccount:
      return handleUpdateCtrlAcc(state,action);
    default:
      return state;
  }
};

function handleAdminStatus(state, action) {
  let updatedAdmin = action.status;
  updatedAdmin.admined = Immutable.Map(updatedAdmin.admined);
  return state.merge(Immutable.Map(updatedAdmin));
}

function handleCreatedCtrlAcc(state, action) {
  const createdCtrlAcc = action.account;
  const upAdmined = state
    .get(adminFields.admined)
    .set(createdCtrlAcc.username, createdCtrlAcc);
  return state
    .set(adminFields.admined, upAdmined);
}

function handleRemovedCtrlAcc(state, action) {
  const removedCtrlAcc = action.removed;
  const upAdmined = state
    .get(adminFields.admined)
    .delete(removedCtrlAcc);
  return state
    .set(adminFields.admined, upAdmined);
}

function handleUpdateCtrlAcc(state, action) {
  const updatedCtrlAcc = action.updated;
  const upAdmined = state
    .get(adminFields.admined)
    .set(updatedCtrlAcc.username, updatedCtrlAcc);
  return state
    .set(adminFields.admined, upAdmined);
}

export default adminAccountReducer;
