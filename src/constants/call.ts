export const callStatus = {
  Initiated: 'initiated',
  Ringing: 'ringing',
  Ongoing: 'ongoing',
  Ended: 'ended',
  Rejected: 'rejected',
  Missed: 'missed',
  Failed: 'failed',
} as const;

export const callType = {
  Voice: 'voice',
  Video: 'video',
} as const;

export const signalType = {
  Offer: 'offer',
  Answer: 'answer',
  IceCandidate: 'ice-candidate',
  Hangup: 'hangup',
} as const;
