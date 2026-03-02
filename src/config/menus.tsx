export interface NavItem {
  label: string;
  path: string;
}

export const getMenusByRole = (role: string): NavItem[] => {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Students", path: "/students" },
        { label: "Officers", path: "/officers" },
      ];
    case "student":
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/profile" },
      ];
    default:
      return [];
  }
};