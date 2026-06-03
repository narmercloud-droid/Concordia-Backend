import crypto from 'crypto';

export function createDriverSession() {
  return 'driver_' + crypto.randomBytes(8).toString('hex');
}
