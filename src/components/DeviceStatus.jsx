import React, { useState } from 'react';

const DeviceStatus = ({ deviceId }) => {
  const [status] = useState('online');
  const [latestTransaction] = useState({
    type: 'credit',
    amount: 1500,
    note: 'Demo Transaction',
    timestamp: new Date().toLocaleString()
  });

  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="text-foreground">Device Status: Connected (Demo)</span>
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
