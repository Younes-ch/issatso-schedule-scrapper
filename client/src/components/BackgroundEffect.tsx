import colorStore from "@/stores/colorStore";

const BackgroundEffect = () => {
  const color = colorStore((state) => state.color) === "blue" ? "bg-primary" : "bg-red-600";
  const key = Date.now();
  return (
    <ul key={key} className="fixed w-[100vw] h-[100vh] overflow-hidden top-0 left-0 m-0 p-0 -z-10 filter blur-3xl">
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[37%] w-[130px] h-[130px] bottom-[-130px] delay-1000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[10%] w-[131px] h-[131px] bottom-[-131px] delay-2000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[52%] w-[148px] h-[148px] bottom-[-148px] delay-6000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[38%] w-[145px] h-[145px] bottom-[-145px] delay-6000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[7%] w-[186px] h-[186px] bottom-[-186px] delay-18000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[19%] w-[182px] h-[182px] bottom-[-182px] delay-4000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[24%] w-[103px] h-[103px] bottom-[-103px] delay-5000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[25%] w-[177px] h-[177px] bottom-[-177px] delay-17000`}
      ></li>
      <li
        className={`absolute block list-none ${color} mix-blend-multiply animate-float left-[87%] w-[123px] h-[123px] bottom-[-123px] delay-22000`}
      ></li>
    </ul>
  );
};

export default BackgroundEffect;
