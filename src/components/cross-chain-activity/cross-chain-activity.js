"use client";
import { getChains } from "@/axios";
import React, { useEffect, useState } from "react";
import CrossChainActivityTable from "../cross-chain-activity-table/cross-chain-activity-table";

const CrossChainActivity = () => {
  // States
  const [chainNumber, setChainNumber] = useState(0);

  // UseEffects
  const getConnectedChains = () => {
    getChains().then((res) => {
      setChainNumber(res.length);
    });
  };

  useEffect(() => {
    getConnectedChains();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-3/4 my-4 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold">Cross Chain Activity</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-75 animate-ping"></div>
              <div className="relative w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <span>Connected Chains: {chainNumber}</span>
          </div>
        </div>
      </div>
      <CrossChainActivityTable chainNumber={chainNumber} />
    </div>
  );
};

export default CrossChainActivity;
