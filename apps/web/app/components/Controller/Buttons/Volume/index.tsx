import "./style.css";

import { Volume2Icon, VolumeOffIcon } from "lucide-react";

type Props = {
  muted: boolean;
  onChange: (muted: boolean) => void;
};

export default function VolumeButton({ muted, onChange }: Props) {
  return (
    <div
      className="better-ig-volume-button"
      onClick={() => {
        onChange(!muted);
      }}
    >
      {muted ? <VolumeOffIcon /> : <Volume2Icon />}
    </div>
  );
}
