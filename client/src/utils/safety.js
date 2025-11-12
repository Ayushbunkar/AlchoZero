export const suggestionsForRisk = (risk) => {
  if (risk >= 0.7) {
    return ['Pull Over Safely', 'Call Emergency Contact', 'Drink Water', 'Open Windows'];
  }
  if (risk >= 0.4) {
    return ['Stay Alert', 'Take a short break', 'Play calming music'];
  }
  return ['All good. Keep following road safety rules.'];
};
