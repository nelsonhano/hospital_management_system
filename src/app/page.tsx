import PatientForm from "@/components/form/PatientForm";
import PassKeyModal from "@/components/ui/PassKeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';
  
  return (
    <div className="flex max-h-screen h-screen">
      {/* TODO: TOP VERIFICTION | P KEY */}
      {isAdmin && <PassKeyModal />}

      <div className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image 
            src='assets/icons/logo-full.svg'
            width={1000}
            height={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left  ">
              © 2025 CarePlus
            </p>
            <Link href='/?admin=true' className="text-green-500">Admin</Link>
          </div>
        </div>
      </div>
      <Image 
        src='/assets/images/onboarding-img.png'
        width={1000}
        height={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
