import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ServerError = () => {

  const { toast } = useToast();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing...",
      description: "Attempting to reconnect to the server.",
    });

    window.location.href = '/';
    // Here you would typically attempt to reconnect or refresh the page
  };

  const handleContact = () => {
    window.location.href = "mailto:ishvinder133@gmail.com";
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Server Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We're experiencing some problems with our server. Please wait or contact support.
          </p>
        
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Now
          </Button>
          <Button variant="secondary" size="sm" onClick={handleContact}>
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServerError;
