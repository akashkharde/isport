
const BASE_URL = 'http://cms.bettorlogic.com/api/BetBuilder';

export const fetchFixtures = async (date) => {
  const response = await fetch(`${BASE_URL}/GetFixtures?sports=1&date=${date}`);
  const data = await response.json();
  return data;
};

export const fetchMarkets = async () => {
  const response = await fetch(`${BASE_URL}/GetMarkets?sports=1`);
  const data = await response.json();
  return data;
};

export const fetchSelections = async () => {
  const response = await fetch(`${BASE_URL}/GetSelections?sports=1`);
  const data = await response.json();
  return data;
};

export const fetchBetBuilderBets = async (matchId, marketId, legs) => {
  const response = await fetch(
    `${BASE_URL}/GetBetBuilderBets?sports=1&matchId=${matchId}&marketId=${marketId}&legs=${legs}&language=en`
  );
  const data = await response.json();
  return data;
};
