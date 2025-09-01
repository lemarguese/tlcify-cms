import type { ReactNode } from "react";

const Permission = ({ user_permission, permission, children }: {
  permission: string;
  user_permission: string[];
  children?: ReactNode
}) => {
  return user_permission.includes(permission) ? <>{children}</> : null;
}

export default Permission;
