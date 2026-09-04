const dns = require('dns');
const mongoose = require('mongoose');

let memoryMode = false;

function preferReliableDns() {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '172.20.10.1']);
    if (typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch (error) {
    console.warn('Could not adjust DNS settings:', error.message);
  }
}

function srvHostFromUri(uri) {
  const match = uri.match(/mongodb\+srv:\/\/(?:[^@]+@)?([^/?]+)/i);
  return match ? match[1] : null;
}

function credentialsFromUri(uri) {
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/i);
  if (!match) return null;
  return {
    user: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2]),
  };
}

function databaseFromUri(uri) {
  const match = uri.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/i);
  return match ? match[1] : 'Edushare';
}

async function standardUriFromSrv(uri) {
  const host = srvHostFromUri(uri);
  const credentials = credentialsFromUri(uri);
  if (!host || !credentials) return null;

  const records = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
  if (!records.length) return null;

  const hosts = records.map((record) => `${record.name}:${record.port}`).join(',');
  const database = databaseFromUri(uri);
  const user = encodeURIComponent(credentials.user);
  const password = encodeURIComponent(credentials.password);

  return `mongodb://${user}:${password}@${hosts}/${database}?tls=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
}

async function connectWithUri(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    family: 4,
  });
}

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    memoryMode = true;
    console.warn('MONGO_URI is missing. EduLanka API will serve the local sample catalogue.');
    return false;
  }

  mongoose.set('strictQuery', true);
  preferReliableDns();

  try {
    await connectWithUri(uri);
    memoryMode = false;
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return true;
  } catch (primaryError) {
    try {
      const fallbackUri = await standardUriFromSrv(uri);
      if (!fallbackUri) throw primaryError;
      await connectWithUri(fallbackUri);
      memoryMode = false;
      console.log(`MongoDB connected via SRV fallback: ${mongoose.connection.name}`);
      return true;
    } catch (error) {
      memoryMode = true;
      console.warn(`MongoDB unavailable (${error.message}). Serving the local sample catalogue.`);
      return false;
    }
  }
}

function isMemoryMode() {
  return memoryMode;
}

module.exports = connectDB;
module.exports.isMemoryMode = isMemoryMode;
