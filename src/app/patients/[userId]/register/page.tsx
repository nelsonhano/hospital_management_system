import RegisterForm from '@/components/form/Register';
import { getUser } from '@/lib/actions/patient.action'
import Image from 'next/image';
import React from 'react'

export default async function Page({ params: { userId } }: SearchParamProps) {
    const user = await getUser(userId);

    return (
        <section className="flex max-h-screen h-screen">
            <div className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 py-10 flex-col">
                    <Image
                        src='/assets/icons/logo-full.svg'
                        width={1000}
                        height={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />

                    <RegisterForm user={user} />
                    <p className="copyright py-12">
                        © 2025 CarePlus
                    </p>
                </div>
            </div>
            <Image
                src='/assets/images/register-img.png'
                width={1000}
                height={1000}
                alt="patient"
                className="side-img max-w-[35%]"
            />
        </section>
    )
}
