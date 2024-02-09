import WelcomeHeader from "@/components/WelcomeHeader";
import colorStore from "@/stores/colorStore";
import { useEffect } from "react";

const Home = () => {
  const setColor = colorStore((state) => state.setColor);
  useEffect(() => {
    setColor("blue");
  }, [])
  return (
    <>
      <WelcomeHeader />
    </>
  );
};

export default Home;
