"use client";
import React, { useEffect, useState } from "react";
import { useGlobalStore } from "../global/global";
import { toArray } from "@/lib/parser";
import { toNumber } from "@/lib/number";
import { getChainData } from "@/lib/config";
import { NetworkGraph } from "../network-graph/network-graph";
import _ from "lodash";

const AxelarNodeGraph = () => {
  const [data, setData] = useState(null);
  const [networkGraph, setNetworkGraph] = useState(null);
  const { chains, stats } = useGlobalStore();

  useEffect(() => {
    const metrics = [
      "GMPStats",
      "GMPTotalVolume",
      "transfersStats",
      "transfersTotalVolume",
    ];
    const getData = async () => {
      if (chains && stats) {
        setData(
          Object.fromEntries(
            await Promise.all(
              toArray(
                metrics.map(
                  (d) =>
                    new Promise(async (resolve) => {
                      switch (d) {
                        case "GMPStats":
                          resolve([d, { ...(stats[d] || (await GMPStats())) }]);
                          break;
                        case "GMPTotalVolume":
                          resolve([
                            d,
                            toNumber(stats[d] || (await GMPTotalVolume())),
                          ]);
                          break;
                        case "transfersStats":
                          resolve([
                            d,
                            { ...(stats[d] || (await transfersStats())) },
                          ]);
                          break;
                        case "transfersTotalVolume":
                          resolve([
                            d,
                            toNumber(
                              stats[d] || (await transfersTotalVolume())
                            ),
                          ]);
                          break;
                        default:
                          resolve();
                          break;
                      }
                    })
                )
              )
            )
          )
        );
      }
    };
    getData();
  }, [chains, stats, setData]);

  useEffect(() => {
    const getData = async () => {
      if (data) {
        const chainIdsLookup = {};
        setNetworkGraph(
          _.orderBy(
            Object.entries(
              _.groupBy(
                toArray(
                  _.concat(
                    (
                      await Promise.all(
                        ["gmp", "transfers"].map(
                          (d) =>
                            new Promise(async (resolve) => {
                              switch (d) {
                                case "gmp":
                                  resolve(
                                    toArray(data.GMPStats?.messages).flatMap(
                                      (m) =>
                                        toArray(
                                          m.sourceChains || m.source_chains
                                        ).flatMap((s) =>
                                          toArray(
                                            s.destinationChains ||
                                              s.destination_chains
                                          ).map((d) => {
                                            let sourceChain =
                                              chainIdsLookup[s.key] ||
                                              getChainData(s.key, chains)?.id;
                                            chainIdsLookup[s.key] = sourceChain;
                                            sourceChain = sourceChain || s.key;

                                            let destinationChain =
                                              chainIdsLookup[d.key] ||
                                              getChainData(d.key, chains)?.id;
                                            chainIdsLookup[d.key] =
                                              destinationChain;
                                            destinationChain =
                                              destinationChain || d.key;

                                            return {
                                              id: toArray([
                                                sourceChain,
                                                destinationChain,
                                              ]).join("_"),
                                              sourceChain,
                                              destinationChain,
                                              num_txs: d.num_txs,
                                              volume: d.volume,
                                            };
                                          })
                                        )
                                    )
                                  );
                                  break;
                                case "transfers":
                                  resolve(
                                    toArray(data.transfersStats?.data).map(
                                      (d) => {
                                        let sourceChain =
                                          chainIdsLookup[d.source_chain] ||
                                          getChainData(d.source_chain, chains)
                                            ?.id;
                                        chainIdsLookup[d.source_chain] =
                                          sourceChain;
                                        sourceChain =
                                          sourceChain || d.source_chain;

                                        let destinationChain =
                                          chainIdsLookup[d.destination_chain] ||
                                          getChainData(
                                            d.destination_chain,
                                            chains
                                          )?.id;
                                        chainIdsLookup[d.destination_chain] =
                                          destinationChain;
                                        destinationChain =
                                          destinationChain ||
                                          d.destination_chain;

                                        return {
                                          id: toArray([
                                            sourceChain,
                                            destinationChain,
                                          ]).join("_"),
                                          sourceChain,
                                          destinationChain,
                                          num_txs: d.num_txs,
                                          volume: d.volume,
                                        };
                                      }
                                    )
                                  );
                                  break;
                                default:
                                  resolve();
                                  break;
                              }
                            })
                        )
                      )
                    ).flatMap((d) => d)
                  )
                ).filter((d) => d.sourceChain && d.destinationChain),
                "id"
              )
            ).map(([k, v]) => ({
              ..._.head(v),
              id: k,
              num_txs: _.sumBy(v, "num_txs"),
              volume: _.sumBy(v, "volume"),
            })),
            ["num_txs"],
            ["desc"]
          )
        );
      }
    };
    getData();
  }, [data, setNetworkGraph]);

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex flex-col w-3/4 gap-y-4 items-center">
        <h2 className="text-2xl font-semibold">Network Graph</h2>
        <div className="lg:col-span-2">
          <NetworkGraph data={networkGraph} />
        </div>
      </div>
    </div>
  );
};

export default AxelarNodeGraph;
