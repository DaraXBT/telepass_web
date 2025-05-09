// In-memory storage for users
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

let users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 3;

export function findMany(): User[] {
  return users;
}

export function create(
  data: Omit<User, "id" | "createdAt" | "updatedAt">
): User {
  const newUser: User = {
    id: nextId++,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  return newUser;
}

export function count(criteria?: any): number {
  if (!criteria) {
    return users.length;
  }

  // Simple filtering logic could be added here based on criteria
  return users.length;
}
