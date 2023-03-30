"use client";

import { useEffect, useState } from "react";

// traffic generator:
// - tick based
// - set origin and destination (randomly)
// - origin and destination spread randomly on graph
// - amount of vehicle represent graph weight
// graphs of origin and destination represented by [][] array of n by n
// - same origin represented by -1
// - no traffic represented by 0
// - traffic represented by > 1
// user input destination
// use string matching if match not found (close approximation)
// 1 traffic cycle: vehicle go from origin to destination and back
// 1 tick = 1 minute? 1440 tick/day

const TrafficSim = () => {
  const [nodes, setNodes] = useState(5);
  const [distanceGraph, setDistanceGraph] = useState<number[][]>([[]]);
  const [trafficGraph, setTrafficGraph] = useState<number[][]>([[]]);

  const initDistanceGraph = (nodes: number) => {
    // fill graph with values between 0 and 10
    const graphArray = Array.from({ length: nodes }, () =>
      Array.from({ length: nodes }, () => Math.floor(Math.random() * 10))
    );

    // set diagonal to 0
    for (let i = 0; i < nodes; i++) {
      graphArray[i][i] = 0;
    }

    setDistanceGraph(graphArray);
  };

  const initTrafficGraph = (nodes: number) => {
    // fill entire graph with 0
    const graphArray = new Array(nodes)
      .fill(1)
      .map(() => new Array(nodes).fill(0));

    // set diagonal to -1
    for (let i = 0; i < nodes; i++) {
      graphArray[i][i] = -1;
    }

    setTrafficGraph(graphArray);
  };

  useEffect(() => {
    initDistanceGraph(nodes);
    initTrafficGraph(nodes);
  }, []);

  return (
    <main>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <h1>Distance Graph</h1>
          <div className="grid grid-cols-6">
            <span></span>
            {distanceGraph.map((col, j) => {
              return (
                <span className="font-bold border-b-2 p-2" key={j}>
                  {j}
                </span>
              );
            })}
            {distanceGraph.map((row, i) => {
              return (
                <>
                  <span className="font-bold border-r-2 p-2" key={i}>
                    {i}
                  </span>
                  {row.map((col, j) => {
                    return (
                      <span key={j} className="p-2">
                        {col}
                      </span>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1>Traffic Graph</h1>
          <div className="grid grid-cols-6">
            <span></span>
            {trafficGraph.map((col, j) => {
              return (
                <span className="font-bold border-b-2 p-2" key={j}>
                  {j}
                </span>
              );
            })}
            {trafficGraph.map((row, i) => {
              return (
                <>
                  <span className="font-bold border-r-2 p-2" key={i}>
                    {i}
                  </span>
                  {row.map((col, j) => {
                    return (
                      <span key={j} className="p-2">
                        {col}
                      </span>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrafficSim;

