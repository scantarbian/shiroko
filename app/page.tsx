import ClassesView from "@/components/classes";
import Navbar from "@/components/navbar";
import TasksView from "@/components/tasks";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="px-4 grid grid-cols-3 gap-4">
        <div>Here will be time/day/weather information</div>
        <div>
          Here will be some sort of listing of tasks based on importance
        </div>
        <ClassesView className="row-span-6" />
        <TasksView className="col-span-2" />
      </div>
    </main>
  );
}
