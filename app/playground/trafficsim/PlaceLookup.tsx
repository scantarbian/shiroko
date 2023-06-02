import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dijkstra, NodeInformation, DijkstraCalculationData } from "./types";

type Inputs = {
  origin: string;
  destination: string;
};

type Props = {
  calculateDijkstra: Dijkstra;
  nodeInformation: NodeInformation[];
};

const PlaceLookup = ({ nodeInformation, calculateDijkstra }: Props) => {
  const [dijkstraData, setDijkstraData] =
    useState<DijkstraCalculationData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // match origin with nodeInformation alias, get the key
    const origin = nodeInformation.find(
      (node) => node.alias === data.origin
    )?.key;

    console.log("origin", origin);

    // match destination with nodeInformation alias, get the key
    const destination = nodeInformation.find(
      (node) => node.alias === data.destination
    )?.key;

    console.log("destination", destination);

    // calculate dijkstra
    if (origin !== undefined && destination !== undefined) {
      const dijkstraData = calculateDijkstra(origin, destination);
      setDijkstraData(dijkstraData);
    } else {
      console.error("Origin or destination not found");
    }
  };

  console.log(watch("origin"));

  return (
    <div className="flex w-full space-x-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <input
          {...register("origin", {
            required: true,
          })}
          placeholder="Origin"
          className="bg-black border border-white p-1"
        />
        <input
          {...register("destination", {
            required: true,
          })}
          placeholder="Destination"
          className="bg-black border border-white p-1"
        />
        <button type="submit" className="border border-white p-1">
          <span>Calculate</span>
        </button>
      </form>
      <div>
        {dijkstraData && (
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span>Result</span>
              <span>
                {dijkstraData.route
                  .map((node) => {
                    return `${nodeInformation[node].alias} (${nodeInformation[node].name})`;
                  })
                  .join(" -> ")}
              </span>
              <span>Weights: {dijkstraData.totalWeight}</span>
            </div>
            <div className=" grid grid-cols-3">
              <span>NODE</span>
              <span>W FR OG</span>
              <span>PREV NODE</span>
              {dijkstraData.summary.map((node, j) => {
                return (
                  <>
                    <span key={`node-${j}`}>
                      {nodeInformation[node.node].name}
                    </span>
                    <span key={`distance-${j}`}>{node.weight}</span>
                    <span key={`previous-${j}`}>
                      {node.weight === 0
                        ? "N/A"
                        : nodeInformation[node.previous].name}
                    </span>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceLookup;

