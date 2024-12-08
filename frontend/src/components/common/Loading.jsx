import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-64">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold">Loading...</p>
          <p className="my-1 text-xs text-gray-500">Please wait while we are getting the backend ready</p>
        </CardContent>
      </Card>
    </div>
  );
} 