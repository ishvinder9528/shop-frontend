import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';
import ServerError from './ServerError';

const Loading = () => {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [progress, setProgress] = useState(0);
    const [showServerError, setShowServerError] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setShowServerError(true); // Show server error when time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        setProgress(((180 - timeLeft) / 180) * 100);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (showServerError) {
        return (
            <ServerError />
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="w-80 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse"></div>
                        <Loader2 className="w-full h-full text-primary animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Getting Ready</h2>
                    <p className="text-center text-muted-foreground mb-4">
                        Please wait while we prepare the backend for you
                    </p>
                    <Progress value={progress} className="w-full mb-2" />
                    <p className="text-sm font-medium">
                        Estimated time: {formatTime(timeLeft)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Loading;
