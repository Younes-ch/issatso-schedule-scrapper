import BackgroundEffect from "@/components/BackgroundEffect";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <>
      <Header>
        <h1 className="text-transparent scroll-m-20 text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-red-600 via-red-300 to-red-600 bg-clip-text bg-200% animate-shine">
          Error 404
        </h1>
        <p className="text-sm text-secondary-foreground scroll-m-20 font-semibold px-2 md:text-xl lg:text-3xl">
          This page does not exist.
        </p>
        <Button className="text-secondary-foreground mt-4 hide-on-hover bg-200% bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-shine">
          <Link to="/">Go Home</Link>
        </Button>
      </Header>
      <BackgroundEffect color="bg-red-600" />
      <Cursor color="bg-red-600" />
    </>
  );
};

export default Error;
