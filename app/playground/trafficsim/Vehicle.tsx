import { useState } from "react";
import type { Vehicle, NodeInformation } from "./types";

type Props = {
  vehicle: Vehicle;
  id: number;
  nodeInformation: NodeInformation[];
};

const VehicleData = ({ vehicle, id, nodeInformation }: Props) => {
  const [djikstraDataOpen, setDjikstraDataOpen] = useState(false);

  return (
    <div className="grid grid-cols-4 border-2 p-1">
      <span key={`${id}-key`}>
        <span className="font-bold">ID</span> #V{id}
      </span>
      <span key={`${id}-origin`}>
        <span className="font-bold">ORIG</span>{" "}
        {nodeInformation[vehicle.origin].name}
      </span>
      <span key={`${id}-destination`}>
        <span className="font-bold">DEST</span>{" "}
        {nodeInformation[vehicle.destination].name}
      </span>
      <span key={`${id}-position`}>
        <span className="font-bold">CUR POS</span>{" "}
        {nodeInformation[vehicle.position].name}
      </span>
      <span key={`${id}-path`} className="col-span-3">
        <span className="font-bold">PATH</span>{" "}
        {vehicle.route
          .map((node) => {
            return nodeInformation[node].name;
          })
          .join(" -> ")}
      </span>
      <span key={`${id}-dist`}>
        <span className="font-bold">PROG</span> {vehicle.traveledWeights}/
        {vehicle.totalTraveledWeights}/{vehicle.weights}
      </span>
      <button
        onClick={() => {
          setDjikstraDataOpen(!djikstraDataOpen);
        }}
        className="border border-white p-1 col-span-2"
      >
        <span>Show Dijkstra</span>
      </button>
      <div
        className={`col-span-4 ${
          djikstraDataOpen ? "" : "h-0 overflow-hidden"
        }  
    }`}
      >
        <span className=" font-bold">DIJKSTRA CALCULATION DATA</span>
        <div className=" grid grid-cols-3">
          <span>NODE</span>
          <span>W FR OG</span>
          <span>PREV NODE</span>
          {vehicle.dijkstraDebug.summary.map((node, j) => {
            return (
              <>
                <span key={`${id}-node-${j}`}>
                  {nodeInformation[node.node].name}
                </span>
                <span key={`${id}-distance-${j}`}>{node.weight}</span>
                <span key={`${id}-previous-${j}`}>
                  {node.weight === 0
                    ? "N/A"
                    : nodeInformation[node.previous].name}
                </span>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VehicleData;

