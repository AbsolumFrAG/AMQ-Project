import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

interface Player {
  id: string;
  username: string;
  score: number;
  avatar?: string;
}

interface GameState {
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  currentSong?: {
    title: string;
    anime: string;
    type: "opening" | "ending";
  };
}

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    totalRounds: 0,
    timeRemaining: 0,
  });
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      query: { roomId },
    });

    newSocket.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    newSocket.on("player-left", (playerId: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    });

    newSocket.on("game-state", (state: GameState) => {
      setGameState(state);
    });


    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId]);

  const handleSubmitAnswer = () => {
    if (socket && answer.trim()) {
      socket.emit("submit-answer", {
        roomId,
        answer: answer.trim(),
      });
      setAnswer("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4">
      <div className="col-span-3 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <div className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className="flex items-center space-x-2">
              {player.avatar && (
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>{player.username}</span>
              <span className="ml-auto">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-9 border rounded-lg p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>
              Round {gameState.currentRound}/{gameState.totalRounds}
            </span>
            <span>Time: {gameState.timeRemaining}s</span>
          </div>
          <div className="h-2 bg-primary/20 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${(gameState.timeRemaining / 30) * 100}%` }}
            />
          </div>
        </div>

        {gameState.currentSong ? (
          <div className="text-center mb-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ) : (
          <div className="text-center py-12">Waiting for next round...</div>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleSubmitAnswer}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
