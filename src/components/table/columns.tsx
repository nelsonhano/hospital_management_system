"use client"

import { ColumnDef } from "@tanstack/react-table"

import StatusBadge from "../ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../ui/AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

export type AppointmentProps = {
  id: string
  amount: number
  status: "pending" | "scheduled" | "cancelled"
  email: string
}

export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) =>
      <div className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime  }
      </div>
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctors",
    cell: ({ row }) =>{
      const doctors = Doctors.find((doctor) => doctor.name === row.original.primaryPhysician);

      return(
        <div className="flex items-center gap-3">
          {(doctors?.image && doctors?.name) && (
            <Image
              src={doctors?.image}
              alt={doctors?.name}
              width={100}
              height={100}
              className="size-8"
            />
          )}
          <p className="whitespace-nowrap">
            Dr. {doctors?.name}
          </p>
        </div>
      )
    }
  },
  {
    id: "actions",
    header: () => <p className="pl4">Actions</p>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal 
            type='schedule'
            appointment={data}
            userId={data.userId}
            patientId={data.patient.$id}
          />
          <AppointmentModal 
            type='cancel'
            appointment={data}
            userId={data.userId}
            patientId={data.patient.$id}
          />
        </div>
      )
    },
  },
]
