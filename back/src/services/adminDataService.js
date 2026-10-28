import { getConnections } from "../config/setDatabase.js";

// Get all quotations from all user collections for admin
export const getAllQuotationsForAdmin = async () => {
  const { atlasConnection, isOnline } = getConnections();

  if (!isOnline || !atlasConnection) {
    throw new Error("Admin data view requires internet connection");
  }

  const db = atlasConnection.db;
  const collections = await db.listCollections({ name: /^quotations_/ }).toArray();

  const allQuotations = [];

  for (const coll of collections) {
    const collection = db.collection(coll.name);
    const docs = await collection.find({}).toArray();
    allQuotations.push(...docs);
  }

  return allQuotations;
};

// Get all clients from all user collections for admin
export const getAllClientsForAdmin = async () => {
  const { atlasConnection, isOnline } = getConnections();

  if (!isOnline || !atlasConnection) {
    throw new Error("Admin data view requires internet connection");
  }

  const db = atlasConnection.db;
  const collections = await db.listCollections({ name: /^clients_/ }).toArray();

  const allClients = [];

  for (const coll of collections) {
    const collection = db.collection(coll.name);
    const docs = await collection.find({}).toArray();
    allClients.push(...docs);
  }

  return allClients;
};

// Get all users from all user collections for admin
export const getAllUsersForAdmin = async () => {
  const { atlasConnection, isOnline } = getConnections();

  if (!isOnline || !atlasConnection) {
    throw new Error("Admin data view requires internet connection");
  }

  const db = atlasConnection.db;
  const collections = await db.listCollections({ name: /^users_/ }).toArray();

  const allUsers = [];

  for (const coll of collections) {
    const collection = db.collection(coll.name);
    const docs = await collection.find({}, { password: 0, otp: 0 }).toArray();
    allUsers.push(...docs);
  }

  return allUsers;
};

// Get data summary for admin dashboard
export const getAdminDashboardSummary = async () => {
  const { atlasConnection, isOnline } = getConnections();

  if (!isOnline || !atlasConnection) {
    throw new Error("Admin dashboard requires internet connection");
  }

  const db = atlasConnection.db;
  const collections = await db.listCollections().toArray();

  const summary = {
    totalUsers: 0,
    totalClients: 0,
    totalQuotations: 0,
    totalInventories: 0,
    userCollections: [],
  };

  for (const coll of collections) {
    const collection = db.collection(coll.name);
    const count = await collection.countDocuments();

    if (coll.name.startsWith('users_')) {
      summary.totalUsers += count;
      summary.userCollections.push(coll.name.replace('users_', ''));
    } else if (coll.name.startsWith('clients_')) {
      summary.totalClients += count;
    } else if (coll.name.startsWith('quotations_')) {
      summary.totalQuotations += count;
    } else if (coll.name.startsWith('inventories_')) {
      summary.totalInventories += count;
    }
  }

  return summary;
};
