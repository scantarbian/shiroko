export type Vehicle = {
  origin: number;
  destination: number;
  position: number;
  route: number[];
  weights: number;
  traveledWeights: number;
  totalTraveledWeights: number;
  traveledNodes: number;
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
  status: "origin" | "destination";
};

export type Dijkstra = (
  origin: number,
  destination: number
) => DijkstraCalculationData;

