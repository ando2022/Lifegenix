'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Check, Coffee, Heart, Activity, Brain, Apple, Dumbbell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const questionnaireSchema = z.object({
  drinksSmoothiesRegularly: z.enum(['never', 'rarely', 'weekly', 'daily']),
  healthGoals: z.array(z.enum(['energy', 'longevity', 'weight', 'muscle', 'wellness'])).min(1, 'Select at least one goal'),
  nutritionConsciousness: z.enum(['not-at-all', 'somewhat', 'very', 'extremely']),
  exerciseFrequency: z.enum(['never', '1-2-week', '3-4-week', 'daily']),
  preferredFlavors: z.array(z.enum(['sweet', 'fruity', 'green', 'protein', 'nutty'])).min(1, 'Select at least one flavor'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type QuestionnaireForm = z.infer<typeof questionnaireSchema>;

export default function FreeSmoothieEvent() {
  const [step, setStep] = useState<'signup' | 'questionnaire' | 'complete'>('signup');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Add auth checking state
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if coming back from OAuth
  useEffect(() => {
    const checkUser = async () => {
      // First check if there's a code parameter (OAuth callback not processed)
      const code = searchParams.get('code');
      if (code) {
        console.log('OAuth code detected, redirecting to auth callback');
        // Redirect to auth callback to process the code
        router.replace(`/auth/callback?code=${code}&redirect=/event/free-smoothie&event=true`);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      console.log('User check:', {
        user: !!user,
        email: user?.email,
        event: searchParams.get('event'),
        currentStep: step
      });

      // Check for user regardless of event parameter
      if (user) {
        // User is logged in (from OAuth or regular login)
        console.log('User logged in, checking participant status...');
        setUserEmail(user.email || '');
        setUserName(user.user_metadata?.full_name || user.email || '');

        // Check if they've already completed the event
        try {
          const response = await fetch(`/api/event/check-participant?email=${user.email}&eventSlug=free-smoothie`);
          const data = await response.json();
          console.log('Participant check response:', data);

          if (data.exists && data.completed) {
            // Already completed, show voucher
            console.log('User already completed, showing voucher');
            setStep('complete');
          } else if (data.exists && !data.completed) {
            // Started but not completed
            console.log('User started but not completed, going to questionnaire');
            setParticipantId(data.id);
            setStep('questionnaire');
          } else {
            // New participant, register them
            console.log('New participant, registering...');
            const registerResponse = await fetch('/api/event/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                eventSlug: 'free-smoothie',
                email: user.email,
                fullName: user.user_metadata?.full_name || user.email,
                userId: user.id,
              })
            });

            const result = await registerResponse.json();
            console.log('Registration result:', result);

            if (registerResponse.ok) {
              setParticipantId(result.id);
              setStep('questionnaire');
            } else {
              console.error('Registration failed:', result);
              // Still move to questionnaire but without participant ID
              // It will be created when they submit the questionnaire
              setStep('questionnaire');
            }
          }
        } catch (error) {
          console.error('Error checking participant:', error);
          // On error, still try to proceed to questionnaire
          setStep('questionnaire');
        }
      } else {
        console.log('No user found, staying on signup step');
      }

      // Done checking auth
      setCheckingAuth(false);
    };

    checkUser();
  }, [searchParams, router]);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      fullName: '',
      phoneNumber: '',
      password: '',
    }
  });

  const questionnaireForm = useForm<QuestionnaireForm>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      drinksSmoothiesRegularly: 'rarely',
      healthGoals: [],
      nutritionConsciousness: 'somewhat',
      exerciseFrequency: '1-2-week',
      preferredFlavors: [],
    }
  });

  const handleSignUp = async (data: SignUpForm) => {
    setLoading(true);
    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
          }
        }
      });

      if (authError) throw authError;

      // Store participant info
      const response = await fetch('/api/event/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: 'free-smoothie',
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          userId: authData.user?.id,
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setParticipantId(result.id);
      setUserEmail(data.email);
      setUserName(data.fullName);
      setStep('questionnaire');
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async () => {
    setLoadingProvider('google');
    
    try {
      // This will work for both new users and existing users
      // Use the actual production URL for redirectTo
      const redirectOrigin = window.location.hostname === 'localhost'
        ? window.location.origin
        : 'https://www.xova.ch';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/auth/callback?redirect=/event/free-smoothie&event=true`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        alert('Error signing up with Google. Please try again.');
        setLoadingProvider(null);
      }
      // OAuth will redirect, so no need to handle success here
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Error signing up with Google. Please try again.');
      setLoadingProvider(null);
    }
  };

  const handleQuestionnaire = async (data: QuestionnaireForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/event/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          questionnaire: data,
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setStep('complete');
    } catch (error) {
      console.error('Questionnaire error:', error);
      alert('Error submitting questionnaire. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-400 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">You're All Set!</h1>
            <p className="text-lg text-gray-600">
              Show this screen to get your
              <span className="block text-2xl font-bold text-green-600 mt-2">FREE SMOOTHIE!</span>
            </p>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <Coffee className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Valid for one free smoothie</p>
              <p className="text-xs text-gray-500 mt-2">User: {userName || userEmail}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <p className="text-sm text-gray-500">
              Take a screenshot to save this voucher
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Almost There! 🎯</CardTitle>
            <CardDescription>
              Help us create your perfect smoothie by answering a few quick questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...questionnaireForm}>
              <form onSubmit={questionnaireForm.handleSubmit(handleQuestionnaire)} className="space-y-6">
                {/* Question 1: Smoothie Frequency */}
                <FormField
                  control={questionnaireForm.control}
                  name="drinksSmoothiesRegularly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        How often do you drink smoothies? 🥤
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            { value: 'never', label: 'Never' },
                            { value: 'rarely', label: 'Rarely' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'daily', label: 'Daily' },
                          ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all
                                  ${isSelected 
                                    ? 'bg-purple-600 text-white shadow-lg scale-105 border-2 border-purple-700' 
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                  }
                                `}
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 2: Health Goals */}
                <FormField
                  control={questionnaireForm.control}
                  name="healthGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        What are your health goals? (Select all that apply)
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            { value: 'energy', label: 'Energy', icon: Activity },
                            { value: 'longevity', label: 'Longevity', icon: Heart },
                            { value: 'weight', label: 'Weight', icon: Apple },
                            { value: 'muscle', label: 'Muscle', icon: Dumbbell },
                            { value: 'wellness', label: 'Wellness', icon: Brain },
                          ].map((option) => {
                            const Icon = option.icon;
                            const isSelected = field.value?.includes(option.value as any);
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all
                                  flex items-center justify-center gap-2
                                  ${isSelected 
                                    ? 'bg-teal-600 text-white shadow-lg scale-105 border-2 border-teal-700' 
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                  }
                                `}
                                onClick={() => {
                                  const newValue = isSelected
                                    ? field.value.filter(v => v !== option.value)
                                    : [...field.value, option.value];
                                  field.onChange(newValue);
                                }}
                              >
                                <Icon className="w-4 h-4" />
                                {option.label}
                                {isSelected && <Check className="w-3 h-3 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 3: Nutrition Consciousness */}
                <FormField
                  control={questionnaireForm.control}
                  name="nutritionConsciousness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        How conscious are you about nutrition? 🥗
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2 mt-2">
                          {[
                            { value: 'not-at-all', label: 'Not at all' },
                            { value: 'somewhat', label: 'Somewhat' },
                            { value: 'very', label: 'Very conscious' },
                            { value: 'extremely', label: 'Extremely conscious' },
                          ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all text-left
                                  ${isSelected 
                                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg border-2 border-purple-700' 
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                  }
                                `}
                                onClick={() => field.onChange(option.value)}
                              >
                                <div className="flex items-center justify-between">
                                  {option.label}
                                  {isSelected && <Check className="w-5 h-5" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 4: Exercise Frequency */}
                <FormField
                  control={questionnaireForm.control}
                  name="exerciseFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        How often do you exercise? 💪
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            { value: 'never', label: 'Never' },
                            { value: '1-2-week', label: '1-2x/week' },
                            { value: '3-4-week', label: '3-4x/week' },
                            { value: 'daily', label: 'Daily' },
                          ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all
                                  ${isSelected 
                                    ? 'bg-orange-500 text-white shadow-lg scale-105 border-2 border-orange-600' 
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                                  }
                                `}
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question 5: Preferred Flavors */}
                <FormField
                  control={questionnaireForm.control}
                  name="preferredFlavors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        What flavors do you enjoy? (Select all)
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            { value: 'sweet', label: '🍯 Sweet' },
                            { value: 'fruity', label: '🍓 Fruity' },
                            { value: 'green', label: '🥬 Green' },
                            { value: 'protein', label: '💪 Protein' },
                            { value: 'nutty', label: '🥜 Nutty' },
                          ].map((option) => {
                            const isSelected = field.value?.includes(option.value as any);
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`
                                  w-full py-3 px-4 rounded-lg font-medium transition-all
                                  ${isSelected 
                                    ? 'bg-pink-500 text-white shadow-lg scale-105 border-2 border-pink-600' 
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                                  }
                                `}
                                onClick={() => {
                                  const newValue = isSelected
                                    ? field.value.filter(v => v !== option.value)
                                    : [...field.value, option.value];
                                  field.onChange(newValue);
                                }}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  {option.label}
                                  {isSelected && <Check className="w-4 h-4" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Submitting...
                    </div>
                  ) : (
                    'Get My Free Smoothie! 🎉'
                  )}
                </button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Coffee className="w-10 h-10 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold">FREE Smoothie! 🎉</CardTitle>
          <CardDescription className="text-lg mt-2">
            Sign up now and get your free healthy smoothie today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4"
            onClick={handleOAuthSignUp}
            disabled={loadingProvider !== null || loading}
          >
            {loadingProvider === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="fullName"
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
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Create a password to save your preferences
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up & Continue →'}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By signing up, you agree to receive updates about healthy living
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}