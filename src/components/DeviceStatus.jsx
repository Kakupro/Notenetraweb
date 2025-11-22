import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';

const DeviceStatus = ({ deviceId }) => {
  const [status, setStatus] = useState('unknown');
  const [lastOnline, setLastOnline] = useState(null);
  const [latestTransaction, setLatestTransaction] = useState(null); // New state for latest transaction

  useEffect(() => {
    // Use the hardcoded device ID sent by the ESP code
    const currentDeviceId = deviceId || "ESP32_DevKitV1"; 

    if (!currentDeviceId) return;

    // --- Device Status Monitoring (existing logic) ---
    const deviceStatusRef = ref(database, `devices/${currentDeviceId}/status`);
    const deviceLastOnlineRef = ref(database, `devices/${currentDeviceId}/last_online`);

    const unsubscribeStatus = onValue(deviceStatusRef, (snapshot) => {
      const newStatus = snapshot.val();
      setStatus(newStatus ? newStatus : 'offline');
    });

    const unsubscribeLastOnline = onValue(deviceLastOnlineRef, (snapshot) => {
      const timestamp = snapshot.val();
      setLastOnline(timestamp ? new Date(timestamp) : null);
    });

    // --- Transaction Monitoring (new logic) ---
    // Listen to the 'transactions/esp' path for the latest transaction
    const transactionsRef = ref(database, 'transactions/esp');
    const latestTransactionQuery = query(transactionsRef, limitToLast(1));

    const unsubscribeTransactions = onValue(latestTransactionQuery, (snapshot) => {
      if (snapshot.exists()) {
        // Get the single latest transaction
        snapshot.forEach((childSnapshot) => {
          setLatestTransaction(childSnapshot.val());
        });
      } else {
        setLatestTransaction(null);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLastOnline();
      unsubscribeTransactions(); // Clean up new listener
    };
  }, [deviceId]); // Re-run effect if deviceId prop changes

  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <span
          className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
        ></span>
        <span className="text-foreground">
          Device Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {lastOnline && status === 'offline' && (
          <span className="text-muted-foreground">
            (Last online: {lastOnline.toLocaleString()})
          </span>
        )}
      </div>

      {latestTransaction && (
        <div className="mt-4 p-2 bg-card rounded-md border border-border">
          <span className="font-semibold text-foreground">Latest Transaction:</span>
          <p className="text-muted-foreground mt-1">
            Type: {latestTransaction.type.charAt(0).toUpperCase() + latestTransaction.type.slice(1)} ({latestTransaction.note})
          </p>
          <p className="text-muted-foreground">
            Amount: ₹{latestTransaction.amount}
          </p>
          <p className="text-muted-foreground text-xs">
            Time: {latestTransaction.timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeviceStatus;
