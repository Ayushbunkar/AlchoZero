import { useState } from 'react';
import Button from '../common/Button';
import Tilt3D from '../common/Tilt3D';

const BreathalyzerInput = ({ onSubmit }) => {
  const [value, setValue] = useState('0.000');
  return (
    <Tilt3D>
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
      <div className="text-gray-300 text-sm mb-2">Breathalyzer (mock)</div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-200 outline-none focus:ring-2 ring-accent-yellow"
          placeholder="e.g. 0.045"
        />
        <Button onClick={() => onSubmit?.(Number(value))}>Submit</Button>
      </div>
      <div className="text-xs text-gray-500 mt-1">Enter a value between 0.000 and 0.150</div>
    </div>
    </Tilt3D>
  );
};

export default BreathalyzerInput;
