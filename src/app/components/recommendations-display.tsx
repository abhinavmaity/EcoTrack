'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationsDisplayProps {
  recommendations: string | null;
  isLoading: boolean;
}

export default function RecommendationsDisplay({ recommendations, isLoading }: RecommendationsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
             <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating Eco Tips...
          </CardTitle>
          <CardDescription>Our AI is crafting personalized advice for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }
  
  if (!recommendations) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary flex items-center">
            <Lightbulb className="mr-2 h-6 w-6 text-yellow-400" />
            Eco-Friendly Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Submit your usage data to get personalized recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  const recommendationItems = recommendations.split('\n').map(item => item.trim()).filter(item => item.length > 0);

  return (
    <Card className="shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-yellow-400" />
          Eco-Friendly Tips
        </CardTitle>
        <CardDescription>Here are some suggestions based on your consumption:</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendationItems.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside text-sm">
            {recommendationItems.map((item, index) => (
              <li key={index} className="text-foreground/90">{item}</li>
            ))}
          </ul>
        ) : (
           <p className="text-muted-foreground">No specific recommendations generated. Try adjusting your input values.</p>
        )}
      </CardContent>
    </Card>
  );
}
