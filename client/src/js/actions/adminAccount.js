import {Events} from '../constants/adminAccount'

export const setAdminStatus = (status) => {
  return {
    type: Events.getAdminStatus,
    status
  }
};

export const emitCreateCtrlAccount = (object) => {
  return {
    type: Events.emitCreateCtrlAccount,
    object
  }
};
export const addCreatedCtrlAcc = (account) => {
  return {
    type: Events.getCreateCtrlAcc,
    account
  }
};

export const emitRemoveCtrlAccount = (removing) => {
  return {
    type: Events.emitRemoveCtrlAccount,
    removing
  }
};
export const deleteRemovedCtrlAcc = (removed) => {
  return {
    type: Events.getRemoveCtrlAcc,
    removed
  }
};
