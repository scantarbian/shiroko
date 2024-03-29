export type Vehicle = {
  origin: number;
  destination: number;
  position: number;
  previousPosition: number | null;
  route: number[];
  weights: number;
  traveledWeights: number;
  totalTraveledWeights: number;
  traveledNodes: number;
  // just entered a route segment
  justEntered: boolean;
  dijkstraDebug: DijkstraCalculationData;
};

export type DijkstraCalculationData = {
  route: number[];
  totalWeight: number;
  weights: number[];
  previous: number[];
  summary: Array<{
    node: number;
    weight: number;
    previous: number;
  }>;
};

export type NodeInformation = {
  key: number;
  name: string;
  alias?: string;
  status: "origin" | "destination";
};

export type Dijkstra = (
  origin: number,
  destination: number
) => DijkstraCalculationData;

export type GenerateVehicle = (origin: number, destination: number) => Vehicle;

