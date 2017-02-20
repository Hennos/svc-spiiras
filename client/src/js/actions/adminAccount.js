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

export const emitUpdateCtrlAccount = (updating) => {
  return {
    type: Events.emitUpdateCtrlAccount,
    updating
  }
};

export const getUpdatedCtrlAccount = (updated) => {
  return {
    type: Events.getUpdatedCtrlAccount,
    updated
  }
};
