"use client";
import React, { useEffect, useState } from "react";
import {
  getGMPChart,
  getGMPTotalVolume,
  getTransferChart,
  getTransferTotalVolume,
} from "@/axios";

const CrossChainActivityTable = ({ chainNumber }) => {
  // States
  const [gmps, setGMPs] = useState(0);
  const [gmpVolume, setGMPVolume] = useState(0);
  const [transfers, setTransfers] = useState(0);
  const [transferVolume, setTransferVolume] = useState(0);

  // Functions
  const getTableStats = () => {
    getGMPChart()
      .then((res) => {
        setGMPs(res.total);
        getGMPTotalVolume().then((res) => {
          setGMPVolume(res);
          getTransferChart().then((res) => {
            setTransfers(res.total);
            getTransferTotalVolume().then((res) => {
              setTransferVolume(res);
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    }
    return num.toString();
  };

  const formatWithCommas = (num) => {
    const roundedNum = Math.round(num);
    return roundedNum.toLocaleString();
  };

  // UseEffects
  useEffect(() => {
    getTableStats();
  }, []);

  return (
    <div className="w-3/4 mx-auto">
      <div className="grid grid-cols-4 text-center border border-white border-opacity-20">
        {/* Column 1 */}
        <div className="p-8 border-r border-white border-opacity-20 last:border-r-0 text-left">
          <h2 className="text-md text-gray-500 my-4">Transactions</h2>
          <p className="text-3xl font-bold text-white mb-4">
            {formatWithCommas(gmps + transfers)}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>GMP: {formatNumber(gmps)}</span>
            <span>Transfer: {formatNumber(transfers)}</span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="p-8 border-r border-white border-opacity-20 last:border-r-0 text-left">
          <h2 className="text-md text-gray-500 my-4">Volume</h2>
          <p className="text-3xl font-bold text-white mb-4">
            ${formatWithCommas(gmpVolume + transferVolume)}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>GMP: ${formatNumber(gmpVolume)}</span>
            <span>Transfer: ${formatNumber(transferVolume)}</span>
          </div>
        </div>

        {/* Column 3 */}
        <div className="p-8 border-r border-white border-opacity-20 last:border-r-0 text-left">
          <h2 className="text-md text-gray-500 my-4">
            Average Volume / Transaction
          </h2>
          <p className="text-3xl font-bold text-white mb-4">
            $
            {formatWithCommas(
              (gmpVolume + transferVolume) / (gmps + transfers)
            )}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>GMP: ${formatNumber(gmpVolume / gmps)}</span>
            <span>Transfer: ${formatNumber(transferVolume / transfers)}</span>
          </div>
        </div>

        {/* Column 4 */}
        <div className="p-8 border-r border-white border-opacity-20 last:border-r-0 text-left">
          <h2 className="text-md text-gray-500 my-4">GMP Contracts</h2>
          <p className="text-4xl font-bold text-white mb-4">1234</p>
          <div className="flex text-sm text-gray-500">
            <span>Number of chains: {chainNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainActivityTable;
