import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export const fetchDrivers = async (opts = {}) => {
  try {
    const driversRef = collection(db, 'drivers');
    let q = driversRef;
    
    // Apply filters if provided
    if (opts.status) {
      q = query(driversRef, where('status', '==', opts.status));
    }
    
    const querySnapshot = await getDocs(q);
    const drivers = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drivers.push({
        id: doc.id,
        driver_id: doc.id,
        name: data.name || '',
        ...data
      });
    });
    
    // Client-side filtering for search query
    let result = drivers;
    if (opts.q) {
      const searchLower = opts.q.toLowerCase();
      result = result.filter(d => 
        d.name?.toLowerCase().includes(searchLower) ||
        d.driver_id?.toLowerCase().includes(searchLower)
      );
    }
    
    // Client-side risk filtering
    if (opts.minRisk !== undefined) {
      result = result.filter(d => (d.riskScore || 0) >= opts.minRisk);
    }
    if (opts.maxRisk !== undefined) {
      result = result.filter(d => (d.riskScore || 0) <= opts.maxRisk);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching drivers from Firebase:', error);
    return [];
  }
};

export const getDriver = async (id) => {
  try {
    const driverRef = doc(db, 'drivers', id);
    const driverSnap = await getDoc(driverRef);
    
    if (driverSnap.exists()) {
      return {
        id: driverSnap.id,
        driver_id: driverSnap.id,
        name: driverSnap.data().name || '',
        ...driverSnap.data()
      };
    } else {
      throw new Error('Driver not found');
    }
  } catch (error) {
    console.error('Error fetching driver from Firebase:', error);
    throw error;
  }
};

export default { fetchDrivers, getDriver };
