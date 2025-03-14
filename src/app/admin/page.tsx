import Link from "next/link";
import Image from "next/image";


import StatCard from "@/components/ui/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";

export default async function Admin() {
    const appointments = await getRecentAppointmentList();
    
    const { scheduledCount, pendingCount, cancelled, documents } = appointments;
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-4">
        <header className="admin-header">
            <Link href='/' className="cursor-pointer">
                <Image 
                    src='/assets/icons/logo-full.svg'
                    width={32}
                    height={162}
                    alt="Logo"
                    className="h-8 w-fit"
                />
            </Link>

            <div className="text-16-semibold">Admin Dashboard</div>
        </header>

        <main className="admin-main">
            <section className="w-full space-y-4">
                <h1 className="header">Welcome </h1>
                <p className="text-dark-700">Start the day with managing new appointment</p>
            </section>

            <section className="admin-stat">
                <StatCard 
                    type='appointments'
                      count={scheduledCount}
                    label='Schduled appointment'
                    icon='/assets/icons/appointments.svg'
                />

                <StatCard
                    type='pending'
                    count={pendingCount}
                    label='Pending appointment'
                    icon='/assets/icons/pending.svg'
                />

                <StatCard
                    type='cancelled'
                      count={cancelled}
                    label='Cancelled appointment'
                    icon='/assets/icons/cancelled.svg'
                />
            </section>

            <DataTable columns={columns} data={documents} />
        </main>
    </div>
  );
};
