"use client";

import { useEffect, useState } from "react";
import type {
  Dijkstra,
  DijkstraCalculationData,
  NodeInformation,
  Vehicle,
} from "./types";
import VehicleData from "./Vehicle";

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
// on each tick:
// - vehicle move to next node based on djikstra algorithm on distance and traffic graph
// - traffic graph update based on vehicle position

const TrafficSim = () => {
  const [nodes, setNodes] = useState(8);
  const [distanceGraph, setDistanceGraph] = useState<number[][]>([[]]);
  const [trafficGraph, setTrafficGraph] = useState<number[][]>([[]]);
  const [nodeInformation, setNodeInformation] = useState<NodeInformation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tick, setTick] = useState(0);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const initDistanceGraph = (nodes: number) => {
    // generate weighted graph with values between 0 and 10
    const graphArray = new Array(nodes)
      .fill(1)
      .map(() =>
        new Array(nodes).fill(0).map(() => Math.floor(Math.random() * 10))
      );

    // set diagonal to 0
    for (let i = 0; i < nodes; i++) {
      graphArray[i][i] = 0;
    }

    // make graph undirected
    for (let i = 0; i < nodes; i++) {
      for (let j = 0; j < nodes; j++) {
        if (graphArray[i][j] !== 0) {
          graphArray[j][i] = graphArray[i][j];
        }
      }
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

  const initNodeInformation = (nodes: number) => {
    const originChance = 0.5;

    const nodeInformationArray: NodeInformation[] = Array.from(
      { length: nodes },
      (_, i) => {
        const name = String.fromCharCode(65 + i);
        const status = Math.random() < originChance ? "origin" : "destination";

        return {
          key: i,
          name,
          status,
        };
      }
    );

    setNodeInformation(nodeInformationArray);
  };

  const initVehicles = (amount: number) => {
    // vehicle spawn at origin nodes and go to destination nodes
    const originNodes = nodeInformation.filter(
      (node) => node.status === "origin"
    );

    const destinationNodes = nodeInformation.filter(
      (node) => node.status === "destination"
    );

    const vehicleArray: Vehicle[] = Array.from({ length: amount }, () => {
      const origin =
        originNodes[Math.floor(Math.random() * originNodes.length)].key;
      const destination =
        destinationNodes[Math.floor(Math.random() * destinationNodes.length)]
          .key;
      const position = origin;
      const dijkstraData = calculateDijkstra(origin, destination);

      return {
        origin,
        destination,
        position,
        route: dijkstraData.route,
        traveledWeights: 0,
        weights: dijkstraData.totalWeight,
        dijkstraDebug: dijkstraData,
      };
    });

    setVehicles(vehicleArray);
  };

  useEffect(() => {
    initDistanceGraph(nodes);
    initTrafficGraph(nodes);
    initNodeInformation(nodes);
  }, []);

  useEffect(() => {
    if (nodeInformation.length > 0) {
      initVehicles(10);
    }
  }, [nodeInformation]);

  const calculateDijkstra: Dijkstra = (origin, destination) => {
    const weight = new Array(nodes).fill(Infinity);
    const previous = new Array(nodes).fill(null);
    const visited = new Array(nodes).fill(false);
    weight[origin] = 0;

    const getClosestNode = (weight: number[], visited: boolean[]) => {
      let closestNode = null;
      let smallestWeight = Infinity;

      for (let i = 0; i < nodes; i++) {
        if (weight[i] < smallestWeight && !visited[i]) {
          closestNode = i;
          smallestWeight = weight[i];
        }
      }

      return closestNode;
    };

    const getPath = (destination: number, previous: number[]) => {
      const path = [];
      let current = destination;

      while (current !== null) {
        path.push(current);
        current = previous[current];
      }

      return path.reverse();
    };

    const generateSummary: () => DijkstraCalculationData["summary"] = () => {
      const summary: DijkstraCalculationData["summary"] = [];

      for (let i = 0; i < nodes; i++) {
        summary.push({
          node: i,
          weight: weight[i],
          previous: previous[i],
        });
      }

      // sort by distance
      summary.sort((a, b) => a.weight - b.weight);

      return summary;
    };

    for (let i = 0; i < nodes; i++) {
      const closestNode = getClosestNode(weight, visited);

      if (closestNode === null) {
        break;
      }

      visited[closestNode] = true;

      for (let j = 0; j < nodes; j++) {
        if (distanceGraph[closestNode][j] !== 0) {
          const newWeight =
            weight[closestNode] +
            distanceGraph[closestNode][j] +
            trafficGraph[closestNode][j];

          if (newWeight < weight[j]) {
            weight[j] = newWeight;
            previous[j] = closestNode;
          }
        }
      }
    }

    const route: DijkstraCalculationData["route"] = getPath(
      destination,
      previous
    );

    const summary: DijkstraCalculationData["summary"] = generateSummary();

    return {
      route,
      previous,
      totalWeight: weight[destination],
      weights: weight,
      summary,
    };
  };

  useEffect(() => {
    if (isSimulationActive) {
      const interval = setInterval(() => {
        setTick((tick) => tick + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSimulationActive]);

  const toggleSimulation = () => {
    setIsSimulationActive(!isSimulationActive);
  };

  return (
    <main>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <span>Distance Graph</span>
          <div className="grid grid-cols-9">
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
          <div>
            <span>Legend</span>
            <ol className="list-disc">
              <li>0 = Same Origin</li>
              <li>{`>0 = Distance`}</li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span>Traffic Graph</span>
          <div className="grid grid-cols-9">
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
          <div>
            <span>Legend</span>
            <ol className="list-disc">
              <li>-1 = Same Origin</li>
              <li>0 = No traffic</li>
              <li>{`>0 = Traffic amount`}</li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span>Nodes Information</span>
          <div className="grid grid-cols-3">
            <span className="font-bold">NAME</span>
            <span className="font-bold">ID</span>
            <span className="font-bold">STATUS</span>
            {nodeInformation.map((node) => {
              return (
                <>
                  <span key={`${node.key}-name`}>{node.name}</span>
                  <span key={`${node.key}-key`}>{node.key}</span>
                  <span key={`${node.key}-status`}>{node.status}</span>
                </>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span>Vehicles Information</span>
          <div className="grid grid-cols-3">
            {vehicles.map((vehicle, i) => {
              return <VehicleData key={i} vehicle={vehicle} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span>Simulation Data</span>
          <span>Nodes: {nodes}</span>
          <span>Tick: {tick}</span>
          <span>Vehicles: {vehicles.length}</span>
          <button className="py-1 px-4 border-2" onClick={toggleSimulation}>
            <span>{isSimulationActive ? "Stop" : "Start"}</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default TrafficSim;

