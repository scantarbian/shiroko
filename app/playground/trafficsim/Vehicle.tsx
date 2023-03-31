import type { Vehicle } from "./types";

type Props = {
  vehicle: Vehicle;
  id: number;
};

const VehicleData = ({ vehicle, id }: Props) => {
  return (
    <div className="grid grid-cols-4 border-2 p-1">
      <span key={`${id}-key`}>
        <span className="font-bold">ID</span> #V{id}
      </span>
      <span key={`${id}-origin`}>
        <span className="font-bold">ORIG</span> {vehicle.origin}
      </span>
      <span key={`${id}-destination`}>
        <span className="font-bold">DEST</span> {vehicle.destination}
      </span>
      <span key={`${id}-position`}>
        <span className="font-bold">CUR POS</span> {vehicle.position}
      </span>
      <span key={`${id}-path`} className="col-span-3">
        <span className="font-bold">PATH</span> {vehicle.route.join(" -> ")}
      </span>
      <span key={`${id}-dist`}>
        <span className="font-bold">PROG</span> {vehicle.traveledWeights}/
        {vehicle.weights}
      </span>
      <span className="col-span-4 font-bold">DIJKSTRA CALCULATION DATA</span>
      <div className="col-span-4 grid grid-cols-3">
        <span>NODE</span>
        <span>W FR OG</span>
        <span>PREV NODE</span>
        {vehicle.dijkstraDebug.summary.map((node, j) => {
          return (
            <>
              <span key={`${id}-node-${j}`}>{node.node}</span>
              <span key={`${id}-distance-${j}`}>{node.weight}</span>
              <span key={`${id}-previous-${j}`}>{node.previous}</span>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleData;
