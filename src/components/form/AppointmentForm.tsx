"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form
} from "@/components/ui/form";
import CustomeFormField from "./CustomeFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";
import { updateAppointment } from "@/lib/actions/patient.action";

export default function AppointmentForm({ 
    type, 
    userId, 
    patientId,
    appointment,
    setOpen
}:{ 
    type: 'create' | 'cancel' | 'schedule', 
    userId: string, 
    patientId: string,
    appointment: Appointment,
    setOpen: (open: boolean) => void
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    console.log({ appointment });

    // 1. Define your form.
    const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
        resolver: zodResolver(CreateAppointmentSchema),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : '',
            note: appointment ? appointment.note : '',
            cancellationReason: appointment ? appointment.cancellationReason : ''
        },
    });

    let buttonLabel;

    switch (type) {
        case 'create':
            buttonLabel = 'Create appointment'
            break;
        case 'cancel':
            buttonLabel = 'Cancel appointment'
            break;
        case 'schedule':
            buttonLabel = 'Schedule appointment'
            break;
    };

    // 2. Define a submit handler.
    async function onSubmit(FormData: z.infer<typeof CreateAppointmentSchema>) {
        setIsLoading(true);

        let status
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending'
                break;
        };

        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId, 
                    patient: patientId,
                    note: FormData.note,
                    reason: FormData.primaryPhysician,
                    schedule: new Date(FormData.schedule),
                    primaryPhysician: FormData.primaryPhysician,
                    status: status as Status
                };

                const newAppointment = await createAppointment(appointmentData);

                if (newAppointment) {
                    form.reset();
                    router.push(
                        `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );}
            } else {
                const appointmentToUpdte = {
                    userId,
                    appointmentId: appointment.$id,
                    appointment: {
                        primaryPhysician: FormData?.primaryPhysician,
                        schedule: new Date(FormData?.schedule),
                        status: status as Status,
                        cancellationReason: FormData?.cancellationReason
                    },
                    type
                };
                
                const updatedAppointment = await updateAppointment(appointmentToUpdte);

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                };
            };

        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === 'create' && <section className="mb-12 space-y-4">
                    <h1 className="header">Book a new appointment</h1>
                    <p className="text-dark-700">Schdule your appointment in few secs</p>
                </section>}

                {type === 'schedule' && (
                    <>
                        <CustomeFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name='primaryPhysician'
                            label='Doctor'
                            placeholder='Select a doctor'
                        >
                            {Doctors.map((doctor) => (
                                <SelectItem value={doctor.name} key={doctor.name}>
                                    <div className="flex cursor-pointer gap-2 items-center">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomeFormField>

                        <CustomeFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name='schedule'
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='reason'
                                label="Reason for appointment"
                                control={form.control}
                                placeholder="Enter reason for appointment"
                            />

                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='note'
                                label="Note"
                                control={form.control}
                                placeholder="Enter note"
                            />
                        </div>
                    </>
                )}

                {type === 'create' && (
                    <>
                        <CustomeFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name='primaryPhysician'
                            label='Doctor'
                            placeholder='Select a doctor'
                        >
                            {Doctors.map((doctor) => (
                                <SelectItem value={doctor.name} key={doctor.name}>
                                    <div className="flex cursor-pointer gap-2 items-center">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomeFormField>

                        <CustomeFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name='schedule'
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='reason'
                                label="Reason for appointment"
                                control={form.control}
                                placeholder="Enter reason for appointment"
                            />

                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='note'
                                label="Note"
                                control={form.control}
                                placeholder="Enter note"
                            />
                        </div>
                    </>
                )}


                {type === 'cancel' && (
                    <>
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='reason'
                                label="Reason for appointment"
                                control={form.control}
                                placeholder="Enter reason for appointment"
                            />

                            <CustomeFormField
                                fieldType={FormFieldType.TEXTAREA}
                                name='note'
                                label="Note"
                                control={form.control}
                                placeholder="Enter note"
                            />
                        </div>
                    </>
                )}
                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
                >{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}
