import WelcomeHeader from "@/components/WelcomeHeader";
import colorStore from "@/stores/colorStore";

const Home = () => {
  const changeColor = colorStore((state) => state.changeColor);
  changeColor("primary");
  return <WelcomeHeader />;
};

export default Home;
