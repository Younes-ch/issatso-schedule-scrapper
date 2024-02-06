import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import WelcomeHeader from "@/components/WelcomeHeader";

const Home = () => {
  return (
    <>
      <WelcomeHeader />
      <BackgroundEffect color="bg-primary" />
      <Cursor color="bg-primary" />
    </>
  );
};

export default Home;
