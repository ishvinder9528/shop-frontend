import React, { useEffect, useState } from 'react';
import Loading from './Loading';

const HealthCheck = () => {
    const [loading, setLoading] = useState(false);
    let pollingInterval = 2000; // Start with 2 seconds
    const maxInterval = 300000; // Cap at 5 minutes
    const activityTimeout = 300000; // 5 minutes of inactivity
    let pollingTimer = null; // Timer for health checks
    let activityTimer = null; // Timer for user inactivity
    let isPollingActive = false; // Tracks if polling is active
    let isHealthCheckInProgress = false; // Prevents overlapping health checks

    const logTimers = () => {
        console.log("Polling Timer:", pollingTimer);
        console.log("Activity Timer:", activityTimer);
    };

    const checkHealth = async () => {
        if (!isPollingActive) {
            console.log("Polling is inactive. Skipping health check.");
            return;
        }

        if (isHealthCheckInProgress) {
            console.log("Health check already in progress. Skipping this attempt.");
            return;
        }

        isHealthCheckInProgress = true;
        console.log("Starting health check...");

        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/health`);
            console.log("Health check response:", response);

            if (response.ok) {
                console.log("Backend is up!");
                setLoading(false); // Hide loading indicator when server is active
                pollingInterval = 35000; // Reset polling interval
            } else {
                throw new Error("Server is down");
            }
        } catch (error) {
            console.error("Health check failed:", error);
            setLoading(true); // Show loading indicator when server is down
            pollingInterval = Math.min(pollingInterval * 2, maxInterval); // Exponential backoff
        } finally {
            isHealthCheckInProgress = false;
            // logTimers();
        }

        scheduleNextHealthCheck();
    };

    const scheduleNextHealthCheck = () => {
        clearTimeout(pollingTimer); // Clear any existing timer
        if (isPollingActive) {
            console.log(`Scheduling next health check in ${pollingInterval / 1000} seconds.`);
            pollingTimer = setTimeout(checkHealth, pollingInterval);
        }
    };

    const resetActivityTimer = () => {
        console.log("User activity detected. Resetting inactivity timer.");
        clearTimeout(activityTimer); // Clear inactivity timer
        activityTimer = setTimeout(stopPolling, activityTimeout); // Restart inactivity timer

        if (!isPollingActive) {
            console.log("Resuming polling due to user activity.");
            isPollingActive = true;
            setLoading(true); // Show loading immediately as the server might take time to activate
            pollingInterval = 2000; // Reset interval
            checkHealth(); // Start polling immediately
        }
        // logTimers();
    };

    const stopPolling = () => {
        console.log("Stopping polling due to inactivity.");
        isPollingActive = false; // Disable polling
        clearTimeout(pollingTimer); // Clear polling timer
        pollingTimer = null;
        setLoading(true); // Show loading indicator as a simulation
        // logTimers();
    };

    useEffect(() => {
        console.log("Component mounted. Setting up event listeners.");
        // document.addEventListener("mousemove", resetActivityTimer);
        document.addEventListener("keydown", resetActivityTimer);
        document.addEventListener("click", resetActivityTimer);

        resetActivityTimer(); // Start activity timer on mount

        return () => {
            console.log("Cleaning up event listeners and timers.");
            // document.removeEventListener("mousemove", resetActivityTimer);
            document.removeEventListener("keydown", resetActivityTimer);
            document.removeEventListener("click", resetActivityTimer);
            clearTimeout(pollingTimer);
            clearTimeout(activityTimer);
            // logTimers();
        };
    }, []);

    return loading && <Loading />;
};

export default HealthCheck;
