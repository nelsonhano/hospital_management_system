"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form
} from "@/components/ui/form"
import CustomeFormField from "./CustomeFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"


export enum FormFieldType {
  INPUT= 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
};

export default function PatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(FormData: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    
    try {
      const user = await createUser(FormData);
      console.log(user);
      
      if (user) {
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (error) {
      console.log(error);
      
    }
    
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schdule your first appointment</p>
        </section>
        <CustomeFormField
          fieldType={FormFieldType.INPUT} 
          control={form.control}
          name='name'
          label='Full name'
          placeholder='John Doe'
          iconSrc='assets/icons/user.svg'
          iconAlt='user'
        />

        <CustomeFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='email'
          label='Email address'
          placeholder='Johndoe@gmail.com'
          iconSrc='assets/icons/email.svg'
          iconAlt='email'
        />

        <CustomeFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name='phone'
          label='Phone number'
          placeholder='(+234) 910 5555 111'
        />

        <SubmitButton 
          isLoading={isLoading} 
        >Get Started</SubmitButton>
      </form>
    </Form>
  )
}
