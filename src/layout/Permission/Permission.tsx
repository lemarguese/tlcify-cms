import type { ReactNode } from "react";

const Permission = ({ user_permission, permission, children, fallback }: {
  permission: string;
  user_permission: string[];
  children?: ReactNode;
  fallback?: ReactNode;
}) => {
  return user_permission.includes(permission) ? <>{children}</> : fallback;
}

export default Permission;
