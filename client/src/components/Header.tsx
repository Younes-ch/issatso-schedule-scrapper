interface HeaderProps {
  children: React.ReactNode;
}
const Header = ({ children }: HeaderProps) => {
  return <div className="text-center">{children}</div>;
};

export default Header;
