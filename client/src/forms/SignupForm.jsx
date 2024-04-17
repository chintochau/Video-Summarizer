import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/AuthService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const schema = z
  .object({
    // sign up schema
    email: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "", // Add initial value for password field
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    // Add loading state
    setLoading(true);
    try {
      await AuthService.register(data.email, data.password);
    } catch (error) {
      setError("Email already exists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="hello@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <FormDescription className="text-red-500">{error}</FormDescription>
        )}
        <div className="text-center ">
          {loading ? (
            <Button type="submit" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button type="submit">Register</Button>
          )}
        </div>
      </form>
    </Form>
  );
};
