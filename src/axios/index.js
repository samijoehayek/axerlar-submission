import axios from "axios";

// Get Chains
export const getChains = async () => {
  const chains = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/getChains`
  );

  return chains.data;
};

// Get GMP Stats
export const getGMPStats = async () => {
  const gmpStats = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/gmp/GMPStats`
  );

  return gmpStats.data;
};

// Get GMP Chart - This will get us the total number of GMPs
export const getGMPChart = async () => {
  const gmpChart = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/gmp/GMPChart`
  );

  return gmpChart.data;
};

// Get GMP Total Volume - THis will get us the total volume of GMPs
export const getGMPTotalVolume = async () => {
  const gmpTotalVolume = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/gmp/GMPTotalVolume`
  );

  return gmpTotalVolume.data;
};

// Get the Transfer Chart - This will get us the number of transfers
export const getTransferChart = async () => {
  const transferChart = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/token/transfersChart`
  );

  return transferChart.data;
};

// Get the Transfer Total Volume - This will get us the total volume of transfers
export const getTransferTotalVolume = async () => {
  const transferTotalVolume = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HOST}/token/transfersTotalVolume`
  );

  return transferTotalVolume.data;
};
