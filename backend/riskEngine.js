const WEIGHTS = {
  scopeBreadth: 0.30,
  sensitivity: 0.30,
  dormancyDays: 0.25,
  blastRadius: 0.15
};

const SENSITIVITY_SCORES = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 100
};

function computeRiskScore(appConnection) {
  // scopeBreadth: max 100 if > 5 scopes
  const scopeScore = Math.min((appConnection.scopes?.length || 1) * 20, 100);
  
  // sensitivity: based on predefined enum
  const sensitivityScore = SENSITIVITY_SCORES[appConnection.scopeSensitivity || 'low'] || 25;
  
  // dormancyDays: max 100 if > 90 days dormant
  let dormancyDays = 0;
  if (appConnection.dormantSince) {
    const ms = new Date() - new Date(appConnection.dormantSince);
    dormancyDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  }
  const dormancyScore = Math.min((dormancyDays / 90) * 100, 100);
  
  // blastRadius: based on data categories (each adds 20, max 100)
  const blastScore = Math.min((appConnection.dataCategoriesTouched?.length || 1) * 20, 100);

  const finalScore = Math.round(
    (scopeScore * WEIGHTS.scopeBreadth) +
    (sensitivityScore * WEIGHTS.sensitivity) +
    (dormancyScore * WEIGHTS.dormancyDays) +
    (blastScore * WEIGHTS.blastRadius)
  );

  return {
    score: finalScore,
    factors: {
      scopeBreadth: scopeScore,
      sensitivity: sensitivityScore,
      dormancyDays: dormancyScore,
      blastRadius: blastScore
    },
    computedAt: new Date().toISOString()
  };
}

module.exports = { computeRiskScore };
