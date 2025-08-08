import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

const GuessInput = ({ onGuess, disabled }: GuessInputProps) => {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = value.trim();
    if (!g) return;
    onGuess(g);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <Input
        placeholder="Type your guess…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" variant="hero" disabled={disabled}>Submit</Button>
    </form>
  );
};

export default GuessInput;
