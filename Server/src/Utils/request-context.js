import {createNamespace} from 'cls-hooked'

export const namespace = createNamespace('my-app-context');

export function setUserId(userId) {
  namespace.set('userId', userId);
}

export function getUserId() {
  return namespace.get('userId');
}

export function runWithContext(fn) {
  namespace.run(() => {
    fn();
  });
}

/* export default {
  namespace,
  setUserId,
  getUserId,
  runWithContext,
}; */