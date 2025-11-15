//Nebutinas button is https://www.youtube.com/watch?v=1MTyCvS05V4&list=PLEGqtKHMfueeOYHlVEPhVpGXKldWLL2Ch

"use client"

import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form";

interface LoginButtonProps{
    children: React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

export const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}: LoginButtonProps) =>{
    const router = useRouter();

    const onClick = () => {
        router.push("/prisijungimas")
    };
    if (mode === "modal"){
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-8 w-auto bg-transparent border-none">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};


/*
                ) : (
                  <LoginButton mode="modal" asChild>
                    <div className='hidden xl:block'>
                      <LoginIcon />
                    </div>
                  </LoginButton>
                )}
*/