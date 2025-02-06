"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl
} from "@/components/ui/form"
import CustomeFormField from "./CustomeFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "./FileUploader"
import { registerPatient } from "@/lib/actions/patient.action"

export default function RegisterForm({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthDate: new Date(Date.now()),
            gender: "Male" as Gender,
            address: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            primaryPhysician: "",
            insuranceProvider: "",
            insurancePolicyNumber: "",
            allergies: "",
            currentMedication: "",
            familyMedicalHistory: "",
            pastMedicalHistory: "",
            identificationType: "Birth Certificate",
            identificationNumber: "",
            identificationDocument: [],
            treatmentConsent: false,
            disclosureConsent: false,
            privacyConsent: false,
        },
    })
    
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
            setIsLoading(true);
            
            let fileData;

            if (values.identificationDocument && values.identificationDocument.length > 0) {
                const blobFile = new Blob([values.identificationDocument[0]], {
                    type: values.identificationDocument[0].type,
                });

                fileData = new FormData();
                fileData.append('blobFile', blobFile);
                fileData.append('fileName', values.identificationDocument[0].name);
            };
            
            try {
                const patientData = {
                    // ...values,
                    userId: user.$id,
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                    gender: values.gender,
                    address: values.address,
                    allergies: values.allergies,
                    birthDate: new Date(values.birthDate),
                    privacyConsent: values.privacyConsent,
                    treatmentConsent: values.treatmentConsent,
                    primaryPhysician: values.primaryPhysician,
                    currentMedication: values.currentMedication,
                    insuranceProvider: values.insuranceProvider,
                    disclosureConsent: values.disclosureConsent,
                    identificationType: values.identificationType,
                    pastMedicalHistory: values.pastMedicalHistory,
                    identificationNumber: values.identificationNumber,
                    emergencyContactName: values.emergencyContactName,
                    familyMedicalHistory: values.familyMedicalHistory,
                    insurancePolicyNumber: values.insurancePolicyNumber,
                    emergencyContactNumber: values.emergencyContactNumber,
                    identificationDocument: values.identificationDocument? fileData :  undefined,
                };
                
                // @ts-ignore
                const patient = await registerPatient(patientData);
                
                // @ts-ignore
                if(patient) router.push(`/patients/${user.$id}/new-appointment`)
                } catch (error) {
            console.log(error);
        }
};
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi Welcome 👋</h1>
                    <p className="text-dark-700">Let's know more about you.</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <p className="sub-header">Personal Infomation</p>
                    </div>
                </section>

                <CustomeFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name='name'
                    label='Full name'
                    placeholder='John Doe'
                    iconSrc='/assets/icons/user.svg'
                    iconAlt='user'
                />

                <div className="flex flex-col lg:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='email'
                        label='Email'
                        placeholder='Johndoe@gmail.com'
                        iconSrc='/assets/icons/email.svg'
                        iconAlt='email'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name='phone'
                        label='Phone number'
                        placeholder='+234 903 0000 121'
                        iconSrc='/assets/icons/appointments.svg'
                        iconAlt='phone'
                    />
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name='birthDate'
                        label='Date of birth'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name='gender'
                        label='Gender'
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup 
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((gender) => (
                                        <div className="radio-group" key={gender}>
                                            <RadioGroupItem 
                                                value={gender}
                                                id={gender}
                                            />
                                            <Label className="cursor-pointer" htmlFor={gender}>
                                                {gender}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='address'
                        label='Address'
                        placeholder='4b adeoye street akobo ibadan'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='occupation'
                        label='Occupation'
                        placeholder='Software engineer'
                    />
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='emergencyContactName'
                        label='Emergency contact name'
                        placeholder='John doe'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name='emergencyContactNumber'
                        label='Emergency contact number'
                        placeholder='+234 903 0000 121'
                        iconSrc='/assets/icons/appointments.svg'
                        iconAlt='phone'
                    />
                </div>


                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <p className="sub-header">Medical Infomation</p>
                    </div>
                </section>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='insuranceProvider'
                        label='Insurance provider'
                        placeholder='Layer shield insurance'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='insurancePolicyNumber'
                        label='Insurance policy number'
                        placeholder='ABC1234567'
                    />
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name='primaryPhysician'
                        label='Primary Physician'
                        placeholder='Select a physician'
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
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name='allergies'
                        label='Onions, garlic'
                        placeholder='Allergies (if any)'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name='currentMedication'
                        label='Current Medication'
                        placeholder='Paracetamol 500mg'
                    />
                </div>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name='familyMedicalHistory'
                        label='Family medical history'
                        placeholder='Father is short sited, mother is hypertensive'
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name='pastMedicalHistory'
                        label='Past medical history'
                        placeholder='Appendectomy'
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <p className="sub-header">Identification and verification</p>
                    </div>
                </section>

                <div className="flex xl:flex-row gap-4">
                    <CustomeFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name='identificationType'
                        label='Identification type'
                        placeholder='Select an identification type'
                    >
                        {IdentificationTypes.map((type) => (
                            <SelectItem value={type} key={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </CustomeFormField>

                    <CustomeFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name='identificationNumber'
                        label='Identification number'
                        placeholder='0123456789'
                    />
                </div>

                <CustomeFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name='identificationDocument'
                    label='Identification document'
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader 
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}
                />

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>

                    <CustomeFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="treatmentConsent"
                        label="I consent to receive treatment for my health condition."
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="disclosureConsent"
                        label="I consent to the use and disclosure of my health information for treatment purposes."
                    />

                    <CustomeFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I acknowledge that I have reviewed and agree to the privacy policy"
                    />
                </section>     
                <SubmitButton
                    isLoading={isLoading}
                >Get Started</SubmitButton>
            </form>
        </Form>
    )
}
