import mongoose from "mongoose";

export const connect = (connectionString: string): Promise<typeof mongoose> => {
  return mongoose.connect(connectionString);
};

export const disconnect = (): Promise<void> => {
  return mongoose.disconnect();
};
