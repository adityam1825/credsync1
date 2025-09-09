'use client';

import { useState, useRef } from 'react';
import { analyzeImageNewsContent, type AnalyzeImageNewsContentOutput } from '@/ai/flows/analyze-image-news-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileWarning, BadgeCheck, ExternalLink, UploadCloud, Image as ImageIcon, Sparkles, Scale, CircleHelp } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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

export default function ImageAnalyzer() {
  const [result, setResult] = useState<AnalyzeImageNewsContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };
  
  const handleSubmit = async () => {
    if (!file || !imagePreview) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please select an image file to analyze.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const analysisResult = await analyzeImageNewsContent({ photoDataUri: imagePreview });
      setResult(analysisResult);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ClassificationIcon = result ? classificationMap[result.classification].icon : null;
  const classificationStyle = result ? classificationMap[result.classification] : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Content Analysis</CardTitle>
        <CardDescription>Upload an image containing news to check for manipulation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
            className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
        >
            <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {imagePreview ? (
                <div className="relative w-full max-w-sm">
                    <Image
                        src={imagePreview}
                        alt="Image preview"
                        width={400}
                        height={300}
                        className="rounded-md object-contain max-h-60"
                        data-ai-hint="uploaded content"
                    />
                </div>
            ) : (
                <div className="text-center">
                    <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
            )}
        </div>
        
        <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Analyze Image
        </Button>

        {loading && (
            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing the image... this may take a moment.</p>
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
                 {result.manipulationSigns && (
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-primary" />Signs of Manipulation</h3>
                        <p className="text-sm text-muted-foreground">{result.manipulationSigns}</p>
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
