import { ScrollArea } from "@/components/ui/scroll-area";

interface EventLogProps {
  logs: string[];
}

const EventLog = ({ logs }: EventLogProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Live feed</h3>
      <ScrollArea className="h-32 rounded-md border p-3">
        <ul className="space-y-1 text-sm">
          {logs.map((l, i) => (
            <li key={i} className="text-muted-foreground">{l}</li>
          ))}
          {logs.length === 0 && (
            <li className="text-muted-foreground">Join events and matches will appear here.</li>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default EventLog;
