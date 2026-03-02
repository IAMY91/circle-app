'use client';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function TensionSlider({ value, onChange }: Props) {
  const color = value < 33 ? '#22c55e' : value < 66 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-xs text-stone-500">Energy</div>
      <div className="flex items-center gap-1.5">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-24 h-2 rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} ${value}%, #44403c ${value}%)`,
          }}
        />
        <span className="text-xs font-mono font-semibold w-6 text-right" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}
