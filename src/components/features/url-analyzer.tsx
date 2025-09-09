'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeUrlNewsContent, type AnalyzeUrlNewsContentOutput } from '@/ai/flows/analyze-url-news-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, FileWarning, BadgeCheck, ExternalLink, Scale, CircleHelp, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

const classificationMap = {
    true: {
        icon: BadgeCheck,
        color: 'bg-green-500',
        text: 'True',
    },
    fake: {
        icon: FileWarning,
        color: 'bg-red-500',
        text: 'Fake',
    },
    misleading: {
        icon: CircleHelp,
        color: 'bg-yellow-500',
        text: 'Misleading',
    },
};

export default function UrlAnalyzer() {
  const [result, setResult] = useState<AnalyzeUrlNewsContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const analysisResult = await analyzeUrlNewsContent(values);
      setResult(analysisResult);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  
  const ClassificationIcon = result ? classificationMap[result.classification].icon : null;
  const classificationStyle = result ? classificationMap[result.classification] : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>URL Content Analysis</CardTitle>
        <CardDescription>Enter a URL to a news article to check for misinformation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://example.com/news-article"
                          className="pl-10"
                          {...field}
                        />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Analyze URL
            </Button>
          </form>
        </Form>
        {loading && (
            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing the content from the URL... this may take a moment.</p>
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-6">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in-50 duration-500">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {ClassificationIcon && <ClassificationIcon className={`h-6 w-6 text-white ${classificationStyle?.color} rounded-full p-1`} />}
                    Analysis Result: <Badge variant="outline" className={`border-none text-white ${classificationStyle?.color}`}>{classificationStyle?.text}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Scale className="h-4 w-4 text-primary" />Reasoning</h3>
                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                 </div>
                 {result.proofLinks && result.proofLinks.length > 0 && (
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><ExternalLink className="h-4 w-4 text-primary" />Proof Links</h3>
                        <ul className="space-y-2">
                            {result.proofLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                        {link}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                 )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
