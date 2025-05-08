'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Droplets, Flame, Loader2 } from 'lucide-react';
import type { GenerateEcoRecommendationsInput } from '@/ai/flows/generate-eco-recommendations';

const formSchema = z.object({
  electricityUsageKWh: z.coerce.number().min(0, 'Usage must be a positive number.'),
  waterConsumptionLiters: z.coerce.number().min(0, 'Usage must be a positive number.'),
  gasUsageCubicMeters: z.coerce.number().min(0, 'Usage must be a positive number.'),
});

type UtilityFormValues = z.infer<typeof formSchema>;

interface UtilityInputFormProps {
  onSubmit: (data: GenerateEcoRecommendationsInput) => Promise<void>;
  isLoading: boolean;
}

export default function UtilityInputForm({ onSubmit, isLoading }: UtilityInputFormProps) {
  const form = useForm<UtilityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      electricityUsageKWh: 0,
      waterConsumptionLiters: 0,
      gasUsageCubicMeters: 0,
    },
  });

  const handleFormSubmit = async (values: UtilityFormValues) => {
    await onSubmit(values);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Log Your Daily Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="electricityUsageKWh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg">
                    <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                    Electricity Usage (kWh)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="waterConsumptionLiters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg">
                    <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                    Water Consumption (Liters)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gasUsageCubicMeters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg">
                    <Flame className="mr-2 h-5 w-5 text-orange-500" />
                    Gas Usage (m³)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                'Get Eco Recommendations'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
