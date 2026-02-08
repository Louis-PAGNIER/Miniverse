export enum Role {
  NONE = "None",
  USER = "User",
  MODERATOR = "Moderator",
  ADMIN = "Admin",
}

export function roleToValue(role: Role): number {
  switch (role) {
    case Role.USER:
      return 1;
    case Role.MODERATOR:
      return 2;
    case Role.ADMIN:
      return 3;
    default:
      return 0;
  }
}

export function valueToRole(value: number): Role {
  switch (value) {
    case 1:
      return Role.USER;
    case 2:
      return Role.MODERATOR;
    case 3:
      return Role.ADMIN;
    default:
      return Role.NONE;
  }
}

export function upgradeRole(role: Role): Role {
  if (role == Role.ADMIN) return Role.ADMIN;
  return valueToRole(roleToValue(role) + 1);
}

export function downgradeRole(role: Role): Role {
  if (role == Role.NONE) return Role.NONE;
  return valueToRole(roleToValue(role) - 1);
}