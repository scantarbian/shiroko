"use client";

import { useEffect, useState } from "react";
import type {
  Dijkstra,
  DijkstraCalculationData,
  GenerateVehicle,
  NodeInformation,
  Vehicle,
} from "./types";
import VehicleData from "./Vehicle";
import PlaceLookup from "./PlaceLookup";
import PLACES from "@/_mock/places";

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

// constants
const NODES = 8;
const VEHICLES = 21;
const MAX_WEIGHT = 10;

const TrafficSim = () => {
  const [nodes, setNodes] = useState(NODES);
  const [distanceGraph, setDistanceGraph] = useState<number[][]>([[]]);
  const [trafficGraph, setTrafficGraph] = useState<number[][]>([[]]);
  const [nodeInformation, setNodeInformation] = useState<NodeInformation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tick, setTick] = useState(0);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const initDistanceGraph = (nodes: number) => {
    // generate weighted graph with values between 0 and MAX_WEIGHT
    const graphArray = new Array(nodes)
      .fill(1)
      .map(() =>
        new Array(nodes)
          .fill(0)
          .map(() => Math.floor(Math.random() * MAX_WEIGHT))
      );

    // set diagonal to 0
    for (let i = 0; i < nodes; i++) {
      graphArray[i][i] = 0;
    }

    // make graph undirected
    for (let i = 0; i < nodes; i++) {
      for (let j = i; j < nodes; j++) {
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
        // if you want to load custom names, load it here
        const name = String.fromCharCode(65 + i);
        const status = Math.random() < originChance ? "origin" : "destination";
        // randomly assign alias from PLACES (array of names)
        const alias = PLACES[Math.floor(Math.random() * PLACES.length)];

        return {
          key: i,
          name,
          status,
          alias,
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

      return generateVehicle(origin, destination);
    });

    setVehicles(vehicleArray);

    // load initial traffic data
    updateTraffic(vehicleArray);
  };

  const generateVehicle: GenerateVehicle = (
    origin: number,
    destination: number
  ) => {
    const position = origin;
    const dijkstraData = calculateDijkstra(origin, destination);

    return {
      origin,
      destination,
      position,
      previousPosition: null,
      route: dijkstraData.route,
      traveledWeights: 0,
      totalTraveledWeights: 0,
      traveledNodes: 0,
      weights: dijkstraData.totalWeight,
      justEntered: true,
      dijkstraDebug: dijkstraData,
    };
  };

  useEffect(() => {
    Promise.all([
      setTick(0),
      initNodeInformation(nodes),
      initDistanceGraph(nodes),
      initTrafficGraph(nodes),
    ]);
  }, []);

  useEffect(() => {
    if (nodeInformation.length > 0) {
      initVehicles(VEHICLES);
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

  const updateVehicles = () => {
    const newVehicles = vehicles.map((vehicle, id) => {
      const {
        position,
        route,
        traveledWeights,
        destination,
        traveledNodes,
        totalTraveledWeights,
      } = vehicle;

      // handle reaching destination
      if (position === destination) {
        // console.log(`${id} reached destination`);
        // regenerate/reassign vehicle with new destination
        const randomDestination =
          nodeInformation[Math.floor(Math.random() * nodeInformation.length)]
            .key;

        return generateVehicle(vehicle.destination, randomDestination);
      }

      // move vehicle to next node based on weight
      const nextNode = route[traveledNodes + 1];
      const nextNodeWeight = distanceGraph[position][nextNode];

      if (traveledWeights + 1 < nextNodeWeight) {
        // Continue moving to the next node
        return {
          ...vehicle,
          traveledWeights: traveledWeights + 1,
          totalTraveledWeights: totalTraveledWeights + 1,
          justEntered: false,
        };
      } else {
        // Arriving at the next node
        // console.log(`${id} current node`, nodeInformation[position].name);
        // console.log(`${id} next node`, nodeInformation[nextNode].name);
        // console.log(
        //   `${id} progress to next node`,
        //   `${traveledWeights + 1}/${nextNodeWeight}`
        // );

        // if we want to take into account traffic, recalculate dijkstra here

        return {
          ...vehicle,
          position: nextNode,
          previousPosition: position, // update previous position
          traveledNodes: traveledNodes + 1,
          traveledWeights: 0,
          totalTraveledWeights: totalTraveledWeights + 1,
          justEntered: true,
        };
      }
    });

    setVehicles(newVehicles);

    // update traffic graph
    updateTraffic(newVehicles);
  };

  const updateTraffic = (vehiclesData: Vehicle[]) => {
    // if vehicle is travelling from a node to another, increase the traffic
    // if vehicle arrived at destination, decrease the traffic
    const newTrafficGraph = [...trafficGraph]; // copy the existing traffic graph

    vehiclesData.forEach((vehicle) => {
      const { position, previousPosition, route, traveledNodes, justEntered } =
        vehicle;
      const nextPosition = route[traveledNodes + 1];

      // If the vehicle has moved from its previous position, decrease the traffic from the previous node
      if (previousPosition !== null && previousPosition !== position) {
        if (newTrafficGraph[previousPosition][position] > 0) {
          newTrafficGraph[previousPosition][position] -= 1;
        }
      }

      // If the vehicle is not at the end of its route and it just entered a new route segment, increase traffic
      if (nextPosition !== undefined && justEntered) {
        newTrafficGraph[position][nextPosition] += 1;
      }
    });

    setTrafficGraph(newTrafficGraph); // update the traffic graph state
  };

  useEffect(() => {
    if (isSimulationActive) {
      const interval = setInterval(() => {
        setTick((tick) => tick + 1);

        // move vehicles
        updateVehicles();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSimulationActive, updateVehicles]);

  const toggleSimulation = () => {
    setIsSimulationActive(!isSimulationActive);
  };

  function getHeatmapColor(weight: number, maxWeight: number) {
    // Normalize the weight to range 0 - 1
    let normalizedWeight = weight / maxWeight;

    // Calculate the red and green components
    let red = Math.floor(normalizedWeight * 255);
    let green = Math.floor((1 - normalizedWeight) * 255);

    // Return the color in CSS rgb format
    return `rgb(${red}, ${green}, 0)`;
  }

  if (nodeInformation.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <span className="font-bold">Distance Graph</span>
            <div className="grid grid-cols-9">
              <span></span>
              {distanceGraph.map((col, j) => {
                return (
                  <span className="font-bold border-b-2 p-2" key={j}>
                    {nodeInformation[j].name}
                  </span>
                );
              })}
              {distanceGraph.map((row, i) => {
                return (
                  <>
                    <span className="font-bold border-r-2 p-2" key={i}>
                      {nodeInformation[i].name}
                    </span>
                    {row.map((col, j) => {
                      return (
                        <span
                          key={j}
                          className="p-2 text-black"
                          style={{
                            backgroundColor: `${getHeatmapColor(
                              col,
                              MAX_WEIGHT
                            )}`,
                          }}
                        >
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
            <span className="font-bold">Traffic Graph</span>
            <div className="grid grid-cols-9">
              <span></span>
              {trafficGraph.map((col, j) => {
                return (
                  <span className="font-bold border-b-2 p-2" key={j}>
                    {nodeInformation[j].name}
                  </span>
                );
              })}
              {trafficGraph.map((row, i) => {
                return (
                  <>
                    <span className="font-bold border-r-2 p-2" key={i}>
                      {nodeInformation[i].name}
                    </span>
                    {row.map((col, j) => {
                      return (
                        <span
                          key={j}
                          className="p-2 text-black"
                          style={{
                            backgroundColor: `${getHeatmapColor(
                              col,
                              MAX_WEIGHT
                            )}`,
                          }}
                        >
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
        </div>

        <div className="flex flex-col items-center">
          <div className="flex w-full">
            <div className="flex flex-col items-center">
              <span>Nodes Information</span>
              <div className="grid grid-cols-4">
                <span className="font-bold">ID</span>
                <span className="font-bold">NAME</span>
                <span className="font-bold">STATUS</span>
                <span className="font-bold">ALIAS</span>
                {nodeInformation.map((node) => {
                  return (
                    <>
                      <span key={`${node.key}-key`}>{node.key}</span>
                      <span key={`${node.key}-name`}>{node.name}</span>
                      <span key={`${node.key}-status`}>
                        {node.status.substring(0, 4)}
                      </span>
                      <span key={`${node.key}-alias`}>{node.alias}</span>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span>Place Lookup</span>
              <PlaceLookup
                nodeInformation={nodeInformation}
                calculateDijkstra={calculateDijkstra}
              />
            </div>
          </div>
          <span>Vehicles Information</span>
          <div className="grid grid-cols-3">
            {vehicles.map((vehicle, i) => {
              return (
                <VehicleData
                  key={i}
                  vehicle={vehicle}
                  id={i}
                  nodeInformation={nodeInformation}
                />
              );
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
