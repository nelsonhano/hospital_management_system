import AppointmentForm from "@/components/form/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.action";
import Image from "next/image";

export default async function NewAppointment({ params }:SearchParamProps) {
  const getById = await params;
  const { userId } = getById
  const patient = await getPatient(userId)
  return (
    <div className="flex max-h-screen h-screen">
      <div className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src='/assets/icons/logo-full.svg'
            width={1000}
            height={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm 
            type='create'
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright mt-10 py-12">
            © 2025 CarePlus
          </p>
        </div>
      </div>

      <Image
        src='/assets/images/appointment-img.png'
        width={1000}
        height={1000}
        alt="appointment"
        className="side-img max-w-[350px]"
      />
    </div>
  );
}
