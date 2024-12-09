import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const HealthCheck = () => {
    const [loading, setLoading] = useState(false);
    let pollingInterval = 35000; // Start with 35 seconds
    const maxInterval = 300000; // Cap at 5 minutes
    const activityTimeout = 300000; // 5 minutes
    let pollingTimer, activityTimer;

    const checkHealth = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/health`);
            console.log("response", response);

            if (response.ok) {
                console.log("Backend is up!");
                setLoading(false); // Hide loading if it was displayed
                pollingInterval = 35000; // Reset interval on success
            } else {
                throw new Error("Server is down");
            }
        } catch (error) {
            console.error("Health check failed:", error);
            setLoading(true); // Show loading on failure
            console.log("loading:", loading);
            pollingInterval = Math.min(pollingInterval * 2, maxInterval); // Exponential backoff
        }
        scheduleNextHealthCheck();
    };

    const scheduleNextHealthCheck = () => {
        clearTimeout(pollingTimer);
        pollingTimer = setTimeout(checkHealth, pollingInterval);
    };

    const resetActivityTimer = () => {
        clearTimeout(activityTimer);
        activityTimer = setTimeout(stopPolling, activityTimeout); // Stop polling after 1 minute of inactivity
        if (!pollingTimer) {
            checkHealth(); // Start health check if not already running
        }
    };

    const stopPolling = () => {
        clearTimeout(pollingTimer);
        pollingTimer = null;
        console.log("Stopped health checks due to inactivity.");
        // Simulate a failed health check to show loading
        setLoading(true);
    };

    useEffect(() => {
        document.addEventListener("mousemove", resetActivityTimer);
        document.addEventListener("keydown", resetActivityTimer);
        document.addEventListener("click", resetActivityTimer);

        resetActivityTimer(); // Start the initial health check

        return () => {
            document.removeEventListener("mousemove", resetActivityTimer);
            document.removeEventListener("keydown", resetActivityTimer);
            document.removeEventListener("click", resetActivityTimer);
            clearTimeout(pollingTimer);
            clearTimeout(activityTimer);
        };
    }, []);

    return (
        loading && <Loading />
    );
};

export default HealthCheck; 