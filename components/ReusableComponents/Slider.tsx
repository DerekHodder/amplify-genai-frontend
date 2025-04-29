import { FC, useState } from 'react';


interface Props {
  label: string;
  description: string;
  defaultState: number;
  onChange: (n: number) => void;
  labels: string[];
  max: number;
}

  export const Slider: FC<Props> = ({label, description, defaultState, onChange,  labels, max}) => {
  const [slider, setSlider] = useState(defaultState);  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setSlider(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-left text-black dark:text-white">
        {label}
      </label>
      <span className="text-[12px] text-black dark:text-white text-sm">
        {description}
      </span>
      <span className="mt-2 mb-2 text-center text-black dark:text-white">
        {slider.toFixed(1)}
      </span>
      <input
        className="w-full h-[3px] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D42121] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#D42121] [&::-ms-thumb]:appearance-none [&::-ms-thumb]:w-4 [&::-ms-thumb]:h-4 [&::-ms-thumb]:rounded-full [&::-ms-thumb]:bg-[#D42121]"
        style={{
            outline: 'none',
            background: 'linear-gradient(to right, #D42121 0%, #D42121 ' + (slider / max * 100) + '%, #E9DED3 ' + (slider / max * 100) + '%, #E9DED3 100%)',
            boxShadow: '0 2px 4px rgba(196, 164, 132, 0.3), 0 4px 8px rgba(196, 164, 132, 0.1)',
        }}
        type="range"
        min={0.0}
        max={max}
        step={0.1}
        value={slider}
        onChange={handleChange}
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-black dark:text-white">
        {labels.map((label, index) => (
            <li className="flex justify-center" key={index}>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

