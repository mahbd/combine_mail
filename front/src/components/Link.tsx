import { Link as RadixLink } from "@radix-ui/themes";
import { Link as RouterLink } from "react-router-dom";
import { ReactElement } from "react";

interface Props {
  href: string;
  children: ReactElement | string;
  className?: string;
  color?: string;
}

const Link = ({ href, children, className, color }: Props) => {
  return (
    <RouterLink to={href}>
      <RadixLink style={{ color: color }} className={className}>
        {children}
      </RadixLink>
    </RouterLink>
  );
};

export default Link;
