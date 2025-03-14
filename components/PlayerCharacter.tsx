import { Heart, Star } from "lucide-react";

export default function PlayerCharacter() {
  return (
    <div className="absolute z-10 size-10 flex items-center justify-center ">
      <Heart className="size-8 text-red-500" />
      <Star className="size-8 text-yellow-400 absolute" />
    </div>
  );
}
