import config from '@src/config';
import logger from '@src/middleware/Logger';
import mongoose from 'mongoose';

class BaseSchema {
  static mongooseInstance: any;
  static mongooseConnection: mongoose.Connection;

  constructor() {
    BaseSchema.connect();
  }

  static connect(): mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;

    this.mongooseConnection = mongoose.connection;
    this.mongooseConnection.once('open', () => {
      console.log(`Conectado ao mongodb.`);
      logger.error(`Conectado ao mongodb.`);
    });

    this.mongooseInstance = mongoose.connect(config.MONGODB_URI);
    return this.mongooseInstance;
  }
}

BaseSchema.connect();
export default BaseSchema;
