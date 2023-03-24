import { format } from "date-fns";

const Greeting = () => {
  const date = new Date();

  const generateGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <>
      <h1 className="text-lg font-semibold">{`${generateGreeting(
        date
      )}! David 👋`}</h1>
    </>
  );
};

export default Greeting;

