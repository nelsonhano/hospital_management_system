import StatCard from "@/components/ui/StatCard";
import Image from "next/image";
import Link from "next/link";

export default function Admin() {
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
                    count={5}
                    label='Schduled appointment'
                      icon='/assets/icons/appointments.svg'
                />

                <StatCard
                    type='pending'
                    count={20}
                    label='Pending appointment'
                    icon='/assets/icons/pending.svg'
                />

               <StatCard
                    type='cancelled'
                    count={3}
                    label='Cancelled appointment'
                    icon='/assets/icons/cancelled.svg'
                />
            </section>
        </main>
    </div>
  );
};
