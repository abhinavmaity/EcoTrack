
'use client';

import { useState } from 'react';
import UtilityInputForm from './components/utility-input-form';
import UsageDisplay from './components/usage-display';
import RecommendationsDisplay from './components/recommendations-display';
import { handleUtilitySubmission } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { GenerateEcoRecommendationsInput } from '@/ai/flows/generate-eco-recommendations';

interface AppState {
  isLoading: boolean;
  error: string | null;
  lastSubmission: GenerateEcoRecommendationsInput | null;
  recommendations: string | null;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    error: null,
    lastSubmission: null,
    recommendations: null,
  });

  const { toast } = useToast();

  const onFormSubmit = async (data: GenerateEcoRecommendationsInput) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null, recommendations: prev.recommendations })); // Keep old recommendations while loading new ones
    const result = await handleUtilitySubmission(data);
    if (result.success && result.data) {
      setAppState({
        isLoading: false,
        error: null,
        lastSubmission: result.submittedInput || data,
        recommendations: result.data.recommendations,
      });
      toast({
        title: "Success!",
        description: "Recommendations generated based on your input.",
        variant: "default",
      });
    } else {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: result.error || 'Failed to get recommendations.',
        lastSubmission: result.submittedInput || data, // Keep submitted data for display even on error
        // Optionally clear recommendations on error or keep old ones. Current: keep old ones.
        // recommendations: null, 
      }));
      toast({
        title: "Error",
        description: result.error || 'Failed to get recommendations. Please try again.',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <UtilityInputForm onSubmit={onFormSubmit} isLoading={appState.isLoading} />
      
      {appState.error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md">
          <p><strong>Error:</strong> {appState.error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <UsageDisplay data={appState.lastSubmission} isLoading={appState.isLoading} />
        <RecommendationsDisplay recommendations={appState.recommendations} isLoading={appState.isLoading} />
      </div>
    </div>
  );
}

