import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { SliderRange, SliderThumb, SliderTrack } from "@radix-ui/react-slider";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomSettings, setRoomSettings] = useState({
    name: "",
    numberOfSongs: 20,
    songDuration: 30,
    isAnilistSync: false,
  });

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomSettings),
      });
      const data = await response.json();
      navigate(`/room/${data.roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome to Anime Blind Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Join a Room</h2>
          <input
            type="text"
            placeholder="Enter Room Code"
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <button
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => {}}
          >
            Join Room
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Create a Room</h2>
          <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
            <DialogTrigger asChild>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded">
                Create Room
              </button>
            </DialogTrigger>

            <DialogPortal>
              <DialogOverlay className="fixed inset-0 bg-black/50" />
              <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg w-[90vw] max-w-md">
                <DialogTitle className="text-xl font-semibold mb-4">
                  Create a New Room
                </DialogTitle>

                <form onSubmit={handleCreateRoom}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Room Name</label>
                      <input
                        type="text"
                        value={roomSettings.name}
                        onChange={(e) =>
                          setRoomSettings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Number of Songs</label>
                      <Slider
                        className="relative flex items-center w-full h-5"
                        value={[roomSettings.numberOfSongs]}
                        max={50}
                        min={5}
                        step={5}
                        onValueChange={([value]) =>
                          setRoomSettings((prev) => ({
                            ...prev,
                            numberOfSongs: value,
                          }))
                        }
                      >
                        <SliderTrack className="bg-primary/20 relative grow h-1 rounded-full">
                          <SliderRange className="absolute h-full bg-primary rounded-full" />
                        </SliderTrack>
                        <SliderThumb className="block w-5 h-5 bg-primary rounded-full" />
                      </Slider>
                      <span className="text-sm">
                        {roomSettings.numberOfSongs} songs
                      </span>
                    </div>

                    <div>
                      <label className="block mb-2">
                        Song Duration (seconds)
                      </label>
                      <Slider
                        className="relative flex items-center w-full h-5"
                        value={[roomSettings.songDuration]}
                        max={60}
                        min={10}
                        step={5}
                        onValueChange={([value]) =>
                          setRoomSettings((prev) => ({
                            ...prev,
                            songDuration: value,
                          }))
                        }
                      >
                        <SliderTrack className="bg-primary/20 relative grow h-1 rounded-full">
                          <SliderRange className="absolute h-full bg-primary rounded-full" />
                        </SliderTrack>
                        <SliderThumb className="block w-5 h-5 bg-primary rounded-full" />
                      </Slider>
                      <span className="text-sm">
                        {roomSettings.songDuration} seconds
                      </span>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anilistSync"
                        checked={roomSettings.isAnilistSync}
                        onChange={(e) =>
                          setRoomSettings((prev) => ({
                            ...prev,
                            isAnilistSync: e.target.checked,
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="anilistSync">Sync with Anilist</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground px-4 py-2 rounded"
                    >
                      Create Room
                    </button>
                  </div>
                </form>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
