'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PassKeyModal() {
    const [open, setOpen] = useState(true);
    const [passkey, setPassKey] = useState('');
    const [error, setError] = useState('');
    const path = usePathname()

    const router = useRouter();

    const getEncryptedAccessKey = typeof window !== 'undefined' ? window.localStorage.getItem('adminAccessKey') : null;
    
    const closeModal = () => {
        setOpen(false);
        router.push('/');
    };

    useEffect(()=> {
        const accessKey = getEncryptedAccessKey && decryptKey(getEncryptedAccessKey);
        
        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false);
                router.push('/admin');
            } else {
                setOpen(true);
            }
        }
    },[getEncryptedAccessKey])

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);

            localStorage.setItem('adminAccessKey', encryptedKey);

            setOpen(false);
        } else {
            setError('Invalid passkey, please try again.');
        };
    };

  return (
      <>
          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent className="shad-alert-dialog">
                  <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification.

                        <Image 
                            src='/assets/icons/close.svg'
                            alt="close"
                            width={20}
                            height={20}
                            onClick={closeModal}
                            className="cursor-pointer"
                        />
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                          To access the admin page. please enter the passkey.
                      </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div>
                    <InputOTP maxLength={6} value={passkey} onChange={(v) => setPassKey(v)}>
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot className="shad-otp-slot" index={0} />
                            <InputOTPSlot className="shad-otp-slot" index={1} />
                            <InputOTPSlot className="shad-otp-slot" index={2} />
                            <InputOTPSlot className="shad-otp-slot" index={3} />
                            <InputOTPSlot className="shad-otp-slot" index={4} />
                            <InputOTPSlot className="shad-otp-slot" index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    
                    {error && <div className="shad-error text-14-regular mt-4 flex jusctify-center">{error}</div>}
                  </div>
                  <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={(e) => validatePasskey(e)}
                      >
                        Enter Admin Passkey
                      </AlertDialogCancel>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </>
  )
}
