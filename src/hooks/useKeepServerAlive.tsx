import { useEffect } from "react";

export const useKeepServerAlive = () => {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const keepAlive = async () => {
      try {
        await fetch(`${apiUrl}/api/keep-alive`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("🏓 Keep-alive ping sent");
      } catch (error) {
        console.log(
          "🔴 Keep-alive ping failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    // Ping on app load
    keepAlive();

    // Ping every 30 minutes if user is active (tab is visible)
    const interval = setInterval(() => {
      if (!document.hidden && document.visibilityState === "visible") {
        keepAlive();
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Ping when user becomes active again
    const handleVisibilityChange = () => {
      if (!document.hidden && document.visibilityState === "visible") {
        keepAlive();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useKeepServerAlive;
