"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import api from '@/lib/axios';
import Link from 'next/link';
import OAuthButton from '@/components/OAuthButton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['buyer', 'seller']),
    // Seller Fields (Optional initially, refined later)
    phone: z.string().optional(),
    citizenship_id: z.string().optional(),
    pan_number: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'seller') {
        if (!data.phone || data.phone.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phone number is required for sellers (min 10 digits)",
                path: ["phone"]
            });
        }
        if (!data.citizenship_id || data.citizenship_id.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Citizenship ID is required for sellers",
                path: ["citizenship_id"]
            });
        }
    }
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'buyer',
            phone: '',
            citizenship_id: '',
            pan_number: ''
        },
    });

    // Watch role to conditionally render fields
    const selectedRole = useWatch({ control: form.control, name: 'role' });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (values.role === 'seller') {
                // Register as Seller
                await api.post('/api/auth/register-seller', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    phone: values.phone,
                    citizenship_id: values.citizenship_id,
                    pan_number: values.pan_number
                });
                toast.success("Seller Account created! Please log in.");
            } else {
                // Register as Buyer
                await api.post('/api/auth/register', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'buyer'
                });
                toast.success("Account created! Please log in.");
            }
            router.push('/login');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Registration failed';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>I want to join as a...</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="buyer" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Buyer (I want to buy products)
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="seller" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Seller (I want to sell products)
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Seller Specific Fields */}
                            {selectedRole === 'seller' && (
                                <div className="space-y-4 border-l-2 border-blue-500 pl-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+977..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="citizenship_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Citizenship ID / License</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ID Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pan_number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PAN Number (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="PAN..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Register"}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="border-t w-full border-gray-300"></div>
                        <span className="px-2 text-sm text-gray-500 bg-white">Or</span>
                        <div className="border-t w-full border-gray-300"></div>
                    </div>

                    <div className="mt-6 space-y-2">
                        {selectedRole !== 'seller' && (
                            <OAuthButton provider="google" role="buyer" />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col justify-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
