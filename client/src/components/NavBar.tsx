import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Separator } from "./ui/separator";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const isRenderable = useMediaQuery("(min-width: 425px)");

  if (!isRenderable) {
    return (
      <div className="w-full flex justify-end sticky top-3 p-3 z-50">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Menu
              className="w-8 h-8 cursor-pointer"
              aria-expanded={open}
              role="button"
            />
          </DrawerTrigger>
          <DrawerContent className="text-center outline-none text-sm font-medium leading-none">
            <Separator className="my-4" />
            <Link to="/schedules" onClick={() => setOpen(false)}>
              Schedules
            </Link>
            <Separator className="my-4" />
            <Link to="/classrooms/available" onClick={() => setOpen(false)}>
              Available Classrooms
            </Link>
            <Separator className="my-4" />
            <Link to="/classrooms/availability" onClick={() => setOpen(false)}>
              Classroom availability
            </Link>
            <Separator className="my-4" />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-2 justify-center p-3">
      <NavigationMenu className="hide-on-hover">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to="/schedules"
              className="text-sm font-medium leading-none block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
              Schedules
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Classrooms</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:w-[470px] md:grid-cols-2 lg:w-[600px]">
                <ListItem
                  href="/classrooms/available"
                  title="Available classrooms"
                >
                  Get available classrooms for a specific day and session.
                </ListItem>
                <ListItem
                  href="/classrooms/availability"
                  title="Classroom availability"
                >
                  Get the availability of a specific classroom in the week.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href as string}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
