import AlertBanner from './AlertBanner';
import { suggestionsForRisk } from '../../utils/safety';

const AlertCenter = ({ risk }) => {
  const suggestions = suggestionsForRisk(risk);
  return (
    <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col gap-3">
      <div className="text-gray-300 text-sm">Safety Suggestions</div>
      <ul className="text-xs text-gray-400 list-disc ml-5 space-y-1">
        {suggestions.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <AlertBanner show={risk >= 0.7} message="High risk detected! Please pull over safely." />
    </div>
  );
};

export default AlertCenter;
