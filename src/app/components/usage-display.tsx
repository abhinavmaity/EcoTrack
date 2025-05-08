'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Droplets, Flame, BarChart3 } from 'lucide-react';
import type { GenerateEcoRecommendationsInput } from '@/ai/flows/generate-eco-recommendations';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface UsageDisplayProps {
  data: GenerateEcoRecommendationsInput | null;
  isLoading: boolean;
}

const chartConfig = {
  value: { label: "Usage" },
  electricity: { label: "Electricity", color: "hsl(var(--chart-1))" },
  water: { label: "Water", color: "hsl(var(--chart-2))" },
  gas: { label: "Gas", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function UsageDisplay({ data, isLoading }: UsageDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            Your Usage Snapshot
          </CardTitle>
          <CardDescription>Visualizing your latest consumption data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            Your Usage Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Submit your daily usage to see your consumption data here.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { utility: "Electricity", value: data.electricityUsageKWh, unit: "kWh", fill: "var(--color-electricity)" },
    { utility: "Water", value: data.waterConsumptionLiters, unit: "Liters", fill: "var(--color-water)" },
    { utility: "Gas", value: data.gasUsageCubicMeters, unit: "m³", fill: "var(--color-gas)" },
  ];
  

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <BarChart3 className="mr-2 h-6 w-6" />
          Your Usage Snapshot
        </CardTitle>
        <CardDescription>Based on your latest input.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Electricity</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.electricityUsageKWh.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">kWh</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.waterConsumptionLiters.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Liters</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gas</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.gasUsageCubicMeters.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">m³</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Consumption Overview</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-auto sm:aspect-video">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis 
                dataKey="utility" 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  formatter={(value, name, item) => (
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.payload.utility}</span>
                      <span>{Number(value).toLocaleString()} {item.payload.unit}</span>
                    </div>
                  )}
                />}
              />
              <Bar dataKey="value" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>

      </CardContent>
    </Card>
  );
}
