'use client';

import { useState, useRef, useEffect } from 'react';
import { analyzeAudioNewsContent, type AnalyzeAudioNewsContentOutput } from '@/ai/flows/analyze-audio-news-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, StopCircle, FileWarning, BadgeCheck, ExternalLink, Scale, CircleHelp, AudioLines, Quote } from 'lucide-react';
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

export default function AudioAnalyzer() {
  const [result, setResult] = useState<AnalyzeAudioNewsContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setResult(null);
      setError(null);
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description: 'Could not start recording. Please check microphone permissions.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast({
        variant: "destructive",
        title: "No Audio Recorded",
        description: "Please record some audio to analyze.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        try {
            const analysisResult = await analyzeAudioNewsContent({ audioDataUri: base64Audio });
            setResult(analysisResult);
        } catch (e) {
            setError('An error occurred during analysis. Please try again.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
  };
  
  const analysis = result?.analysis;
  const ClassificationIcon = analysis ? classificationMap[analysis.classification].icon : null;
  const classificationStyle = analysis ? classificationMap[analysis.classification] : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Audio Content Analysis</CardTitle>
        <CardDescription>Record a news segment to transcribe and analyze it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
            {!isRecording ? (
                <Button onClick={startRecording} size="lg" className="rounded-full w-24 h-24">
                    <Mic className="h-10 w-10" />
                </Button>
            ) : (
                <Button onClick={stopRecording} size="lg" variant="destructive" className="rounded-full w-24 h-24">
                    <StopCircle className="h-10 w-10" />
                </Button>
            )}
            <p className="text-sm text-muted-foreground">
                {isRecording ? "Recording in progress..." : (audioBlob ? "Recording complete. Ready to analyze." : "Tap to start recording")}
            </p>
        </div>

        {audioBlob && !isRecording && (
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full"></audio>
        )}
        
        <Button onClick={handleSubmit} disabled={loading || !audioBlob || isRecording} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AudioLines />}
          Analyze Audio
        </Button>

        {loading && (
            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing the audio... this may take a moment.</p>
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-6">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && analysis && (
          <div className="mt-6 space-y-4 animate-in fade-in-50 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Quote className="h-5 w-5 text-primary" />
                        Transcription
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">"{result.transcription}"</p>
                </CardContent>
            </Card>
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
                    <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
                 </div>
                 {analysis.proofLinks && analysis.proofLinks.length > 0 && (
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><ExternalLink className="h-4 w-4 text-primary" />Proof Links</h3>
                        <ul className="space-y-2">
                            {analysis.proofLinks.map((link, index) => (
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
