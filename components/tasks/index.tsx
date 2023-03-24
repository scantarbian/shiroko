type Props = {
  className?: string;
};

const TasksView = ({ className }: Props) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold pb-2">Your Tasks</h2>
        <span>Sort by</span>
      </div>

      <div className="border rounded-lg flex flex-col">
        <span>Y</span>
      </div>
    </div>
  );
};

export default TasksView;

