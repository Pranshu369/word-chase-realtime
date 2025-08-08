import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NameModal from "@/components/game/NameModal";
import PlayersList, { type Player } from "@/components/game/PlayersList";
import GuessInput from "@/components/game/GuessInput";
import EventLog from "@/components/game/EventLog";
import { io, Socket } from "socket.io-client";

const Index = () => {
  const [name, setName] = useState<string>(() => sessionStorage.getItem("playerName") || "");
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [matched, setMatched] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const openNameModal = !name;

  useEffect(() => {
    if (!name) return;
    sessionStorage.setItem("playerName", name);

    try {
      const s = io("/", { transports: ["websocket"], autoConnect: true });
      socketRef.current = s;

      s.on("connect", () => {
        s.emit("join", { name });
      });

      s.on("players_update", (payload: { players: Player[] }) => {
        setPlayers(payload.players);
      });

      s.on("player_joined", ({ name: n }: { id: string; name: string }) => {
        setLogs((prev) => [`${n} joined`, ...prev].slice(0, 50));
      });

      s.on("player_left", ({ name: n }: { id: string; name: string }) => {
        setLogs((prev) => [`${n} left`, ...prev].slice(0, 50));
      });

      s.on("guess_result", ({ success, message }: { success: boolean; name: string; message?: string }) => {
        if (success) {
          setMatched(true);
          setLogs((prev) => ["You matched!", ...prev].slice(0, 50));
        } else {
          toast({ title: "Not matched — keep trying" });
        }
        if (message) setLogs((prev) => [message, ...prev].slice(0, 50));
      });

      s.on("log", ({ message }: { message: string }) => {
        setLogs((prev) => [message, ...prev].slice(0, 50));
      });

      s.on("connect_error", () => {
        toast({ title: "Backend not connected", description: "Run the Socket.IO server or connect Supabase Realtime." });
      });

      return () => {
        s.disconnect();
        socketRef.current = null;
      };
    } catch (e) {
      console.error(e);
    }
  }, [name]);

  const handleNameSubmit = (n: string) => {
    setName(n);
  };

  const handleGuess = (guess: string) => {
    if (matched) return;
    const s = socketRef.current;
    if (s && s.connected) {
      s.emit("guess", { name, guess });
    } else {
      toast({ title: "No realtime server detected", description: "This is the UI only. Start the backend to play." });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    document.documentElement.style.setProperty("--mouse-x", `${x}px`);
    document.documentElement.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="min-h-screen relative" onMouseMove={onMouseMove}>
      <div className="ambient-spotlight" ref={spotlightRef} />
      <header className="py-10">
        <h1 className="text-4xl font-extrabold gradient-text text-center">Scribble-Clone</h1>
        <p className="text-center text-muted-foreground mt-2">Realtime multiplayer word guessing</p>
      </header>

      <main className="container grid gap-6 md:grid-cols-[1fr_320px] items-start">
        <Card className="p-6 card-elevated">
          <div className="max-w-2xl mx-auto w-full">
            <GuessInput onGuess={handleGuess} disabled={matched || openNameModal} />
            <EventLog logs={logs} />
            {matched && (
              <div className="mt-6 text-center">
                <Button variant="secondary" onClick={() => toast({ title: "Matched!", description: "Wait for a new round." })}>Matched!</Button>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <PlayersList players={players} />
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Room</h2>
            <p className="text-sm text-muted-foreground">You are in room: <span className="font-medium">main</span></p>
            <p className="text-sm text-muted-foreground mt-1">Player: <span className="font-medium">{name || '—'}</span></p>
          </Card>
        </div>
      </main>

      <NameModal open={openNameModal} onSubmit={handleNameSubmit} />
    </div>
  );
};

export default Index;
