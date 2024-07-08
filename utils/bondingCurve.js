const calculateBondingCurvePrice = (supply) => {
  const price = 0.01 * supply; // Linear bonding curve formula
  return price;
};

module.exports = { calculateBondingCurvePrice };
