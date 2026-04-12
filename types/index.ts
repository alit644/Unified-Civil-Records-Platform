import { Prisma } from "@/lib/generated/prisma/client";
import { CitizenStatus, EventType, Gender, MaritalStatus, Role } from "@/lib/generated/prisma/enums";

export interface Citizen {
      id: string,
      firstName: string,
      lastName: string,
      nationalId: string,
      gender: Gender,
      dateOfBirth: Date,
      maritalStatus: MaritalStatus,
      status: CitizenStatus,
      currentAddress: string | null,
      updatedAt: Date,
      fatherName: string | null,
      motherName: string | null,
      registryPlace: string
      registryNumber: string
      familyBookId: string | null
    }

export interface Event {
  type: EventType;
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
  status: string;
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
  action: string;
  createdAt: Date;
  employee: {
    name: string
  },
  employeeId: string;
  id: string;
  newData: Prisma.JsonValue | null;
  oldData: Prisma.JsonValue | null;
  recordId: string;
  tableName: string;
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
