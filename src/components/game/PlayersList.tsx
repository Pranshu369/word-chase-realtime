import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Player = {
  id: string;
  name: string;
  matched: boolean;
  matchedAt?: string | null;
};

interface PlayersListProps {
  players: Player[];
}

const PlayersList = ({ players }: PlayersListProps) => {
  return (
    <Card className="p-4 card-elevated">
      <h2 className="text-lg font-semibold mb-3">Players</h2>
      <ul className="space-y-2">
        {players.map((p) => (
          <li key={p.id} className="flex items-center justify-between">
            <span className="font-medium">{p.name}</span>
            {p.matched ? (
              <Badge variant="secondary">Matched{p.matchedAt ? ` — ${new Date(p.matchedAt).toLocaleTimeString()}` : ''}</Badge>
            ) : (
              <Badge>Playing</Badge>
            )}
          </li>
        ))}
        {players.length === 0 && (
          <li className="text-sm text-muted-foreground">No players yet</li>
        )}
      </ul>
    </Card>
  );
};

export default PlayersList;
