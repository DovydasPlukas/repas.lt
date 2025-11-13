import { CardWrapper } from "@/components/auth/card-wrapper";
import { TriangleAlert } from 'lucide-react';

export const ErrorCard = () => {
    return(
        <CardWrapper
            headerLabel="Įvyko klaida"
            backButtonHref="/prisijungimas"
            backButtonLabel="Atgal į prisijungimą"
        >
            <div className="w-full flex justify-center items-center">
                <TriangleAlert className="text-destructive" />
            </div>
        </CardWrapper>
    );
};