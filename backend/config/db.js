import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://meliabdu:1020304050@ac-pyjzizf-shard-00-00.nfhvmcz.mongodb.net:27017,ac-pyjzizf-shard-00-01.nfhvmcz.mongodb.net:27017,ac-pyjzizf-shard-00-02.nfhvmcz.mongodb.net:27017/?ssl=true&replicaSet=atlas-mml3tc-shard-0&authSource=admin&appName=Cluster0');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Connection error:', err);
  }
};

