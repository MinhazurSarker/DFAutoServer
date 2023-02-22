function calculate(weight, ptValue, pdValue, rhValue, ptPrice, pdPrice, rhPrice, usdToAed, gbpToAed) {
  const pt = ((ptValue / 1000 / 31.10348) * (ptPrice * usdToAed) * .98)
  const pd = ((pdValue / 1000 / 31.10348) * (pdPrice * usdToAed) * .98)
  const rh = ((rhValue / 1000 / 31.10348) * (rhPrice * usdToAed) * .85)
  const value =
    ((((pt + pd + rh) - ((3.15 * gbpToAed) + (0.44 * gbpToAed) + 7.81)) - 30)) * weight / 1000
  return value
}

console.log(calculate(585, 0, 7560, 561, 800, 1200, 8000, 3.67, 4.65))
