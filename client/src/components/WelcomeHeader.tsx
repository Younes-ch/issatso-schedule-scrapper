
const WelcomeHeader = () => {
  return (
    <div className="text-center">
      <h1 className="text-transparent scroll-m-20 text-2xl font-extrabold tracking-tight md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-primary via-sky-500 via-30% to-primary bg-clip-text bg-200% animate-shine">
        Welcome ISSATIENS.
      </h1>
      <p className="text-sm text-secondary-foreground scroll-m-20 font-semibold px-2 md:text-xl lg:text-3xl">
        This is a website that allows you to check ISSATSo schedules and
        available classrooms.
      </p>
    </div>
  );
};

export default WelcomeHeader;
