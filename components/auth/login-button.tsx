//Nebutinas button is https://www.youtube.com/watch?v=1MTyCvS05V4&list=PLEGqtKHMfueeOYHlVEPhVpGXKldWLL2Ch

"use client"

import { useRouter } from "next/navigation";

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
        router.push("/auth/prisijungimas")
    };
    if (mode === "modal"){
        return (
            <span>
                TODO: Implement modal
            </span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {Children}
        </span>
    );
};