import ClassItem from "./ClassItem";

type Props = {
  className?: string;
};

const ClassesView = ({ className }: Props) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <h2 className="text-lg font-semibold pb-2">Your Courses</h2>
      <div className="border rounded-lg flex flex-col divide-y">
        <ClassItem />
        <ClassItem />
        <ClassItem />
      </div>
    </div>
  );
};

export default ClassesView;

