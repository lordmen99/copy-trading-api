enum STATUS {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  PENDING = 'PENDING',
  FINISH = 'FINISH',
  DELETE = 'DELETE',
  STOP = 'STOP',
  PAUSE = 'PAUSE',
}

enum RATE {
  FEE_TO_EXPERT = 5 / 100,
  FEE_TO_TRADING = 5 / 100,
}
export default {
  STATUS,
  RATE,
};
