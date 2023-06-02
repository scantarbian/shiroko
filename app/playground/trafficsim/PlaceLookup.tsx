import { useForm, SubmitHandler } from "react-hook-form";
import { Dijkstra, NodeInformation } from "./types";

type Inputs = {
  origin: string;
  destination: string;
};

type Props = {
  calculateDijkstra: Dijkstra;
  nodeInformation: NodeInformation[];
};

const PlaceLookup = ({ nodeInformation, calculateDijkstra }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
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
        <span>Result</span>
      </div>
    </div>
  );
};

export default PlaceLookup;

