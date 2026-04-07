import { Role } from "@/lib/generated/prisma/enums";

export interface Citizen {
  name: string;
  nid: string;
  gender: string;
  neighborhood: string;
  marital: string;
  status: string;
  updated: string;
}

export interface Event {
  type: string;
  citizen: string;
  date: string;
  status: string;
  employee: string;
}

export interface Events {
  id: string;
  type: string;
  citizen: string;
  eventDate: string;
  regDate: string;
  deadline: string;
  status: string;
  urgent?: boolean;
}

export interface Doc {
  type: string;
  citizen: string;
  nid: string;
  time: string;
  employee: string;
}

export interface Archive {
  id: string;
  type: string;
  citizen: string;
  date: string;
  size: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  _count: {
    documents: number;
    civilEvents: number;
  }
}

export interface IAuditLog {
  date: string;
  employee: string;
  action: string;
  table: string;
  record: string;
  oldVal: string;
  newVal: string;
}

export interface IUser {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string;
  isActive: boolean;
  name: string;
  role: string;
  updatedAt: Date;
}
