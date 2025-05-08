
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Loader2, Droplet, Zap, Recycle, ShoppingBag, Settings } from 'lucide-react';
import type { ComponentType } from 'react';

interface RecommendationsDisplayProps {
  recommendations: string | null;
  isLoading: boolean; // True when personalized recommendations are being fetched
}

interface GeneralTip {
  id: string;
  text: string;
  imageHint: string;
  icon: ComponentType<{ className?: string }>;
}

const generalTips: GeneralTip[] = [
  { id: 'showerhead', text: "Install a low-flow showerhead to save water without sacrificing pressure.", imageHint: "shower bathroom", icon: Droplet },
  { id: 'powerstrip', text: "Use smart power strips to automatically turn off electronics when not in use.", imageHint: "outlet electronics", icon: Zap },
  { id: 'compost', text: "Compost food scraps to reduce landfill waste and create nutrient-rich soil for your garden.", imageHint: "compost garden", icon: Recycle },
  { id: 'led', text: "Switch to LED light bulbs. They use up to 75% less energy and last much longer than incandescent bulbs.", imageHint: "lightbulb energy", icon: Lightbulb },
  { id: 'bags', text: "Opt for reusable shopping bags instead of single-use plastic bags to reduce plastic pollution.", imageHint: "shopping grocery", icon: ShoppingBag },
];

export default function RecommendationsDisplay({ recommendations, isLoading }: RecommendationsDisplayProps) {
  const recommendationItems = recommendations?.split('\n').map(item => item.trim()).filter(item => item.length > 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-primary" /> 
          Eco-Friendly Tips
        </CardTitle>
        <CardDescription>Personalized advice and general tips to help you save resources.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personalized Recommendations Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3 text-primary/90">Suggestions For You</h3>
          {isLoading && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">Our AI is crafting personalized advice...</p>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {!isLoading && recommendationItems && recommendationItems.length > 0 && (
             <ul className="space-y-2 list-disc list-inside text-sm text-foreground/90">
              {recommendationItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {!isLoading && (!recommendations || (recommendationItems && recommendationItems.length === 0)) && (
            <p className="text-muted-foreground">Submit your usage data to get personalized recommendations, or check out our general tips below.</p>
          )}
        </section>

        <Separator />

        {/* General Household Tips Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-primary/90">General Household Tips</h3>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {generalTips.map((tip) => {
              const TipIcon = tip.icon || Settings;
              return (
                <Card key={tip.id} className="overflow-hidden group shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-full h-48"> {/* Increased height slightly */}
                    <Image
                      src={`https://picsum.photos/seed/${tip.id}/600/300`}
                      alt={tip.text.substring(0, 50)}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={tip.imageHint}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> {/* Gradient overlay for text contrast */}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                       <TipIcon className="h-6 w-6 mr-3 text-accent flex-shrink-0 mt-0.5" /> {/* Adjusted icon size and margin */}
                       <p className="text-sm font-medium text-card-foreground">{tip.text}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
