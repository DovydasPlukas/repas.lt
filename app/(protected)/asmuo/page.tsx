"use client";

/*eslint-disable */

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { PersonSchema } from "@/schemas";
import { savePerson } from "@/actions/person";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { getPersonData } from "@/actions/person";

const PersonPage = () => {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof PersonSchema>>({
        resolver: zodResolver(PersonSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
        }
    });

    useEffect(() => {
        const loadPersonData = async () => {
            try {
                const result = await getPersonData();
                
                if (result.data) {
                    form.reset({
                        firstName: result.data.firstName || "",
                        lastName: result.data.lastName || "",
                        phoneNumber: result.data.phoneNumber || "",
                    });
                }
                
                if (result.error) {
                    setError(result.error);
                }
            } catch (err) {
                setError("Nepavyko įkelti duomenų");
            } finally {
                setIsLoading(false);
            }
        };

        loadPersonData();
    }, [form]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        
        // Remove all non-digit characters
        value = value.replace(/\D/g, "");
        
        // Limit to 8 digits max
        value = value.slice(0, 8);
        
        form.setValue("phoneNumber", value);
    };

    const onSubmit = (values: z.infer<typeof PersonSchema>) => {
        setError(undefined);
        setSuccess(undefined);
        startTransition(() => {
            savePerson(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Įvyko klaida!"));
        });
    }

    if (isLoading) {
        return (
            <Card className="w-[600px]">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">
                        Asmeninė informacija
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">Kraunami duomenys...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Asmeninė informacija
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vardas</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Jūsų vardas"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pavardė</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Jūsų pavardė"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefonas</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                                            <span className="px-4 py-2 font-medium text-gray-700">+370</span>
                                            <input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="600 00000"
                                                type="tel"
                                                onChange={handlePhoneChange}
                                                maxLength={8}
                                                className="flex-1 border-0 px-2 py-2 focus:outline-none"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormError message={error} />
                        <FormSuccess message={success} />

                        <Button disabled={isPending} type="submit" className="w-full">
                            Išsaugoti
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default PersonPage;