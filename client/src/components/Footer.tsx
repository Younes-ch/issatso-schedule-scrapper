import colorStore from "@/stores/colorStore";

const Footer = () => {
  const heart = colorStore((state) => state.color) === "blue" ? "💙" : "❤️";
  return (
    <div className="pb-3 text-center font-medium text-muted-foreground">
      Made with {heart} by{" "}@
      <span className="underline underline-offset-2">
        <a
          href="https://portfolio-website-two-navy-74.vercel.app/"
          target="_blank"
        >
          Younes-ch
        </a>
      </span>
    </div>
  );
};

export default Footer;
