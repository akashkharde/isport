import React, { useState, useEffect } from 'react';
import Header from '../Container/Header';

// Utility function to convert UTC date string to local date string
const convertToLocalDate = (utcDate) => {
  const date = new Date(utcDate);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleString(); // Adjust format as needed
};

const Test = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [legs, setLegs] = useState([]);
  const [selectedLeg, setSelectedLeg] = useState(null);
  const [bets, setBets] = useState([]);

  // Fetches the list of dates from today up to the next 7 days
  const fetchDates = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dateArray = [];
    while (today <= nextWeek) {
      dateArray.push(today.toISOString().slice(0, 10));
      today.setDate(today.getDate() + 1);
    }
    setDates(dateArray);
    console.log("dates", dateArray);
  };

  // Fetches the list of matches for the selected date
  const fetchMatches = async () => {
    const response = await fetch(
      `http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1&date=${selectedDate}`
    );
    const data = await response.json();
    const convertedMatches = data.map((match) => ({
      ...match,
      datetime: convertToLocalDate(match.datetime),
    }));
    setMatches(convertedMatches);
    console.log("matches", convertedMatches);
  };

  // Fetches the list of markets for the selected match
  const fetchMarkets = async () => {
    const response = await fetch(
      `http://cms.bettorlogic.com/api/BetBuilder/GetMarkets?sports=1`
    );
    const data = await response.json();
    setMarkets(data);
    console.log("markets", data);
  };

  // Fetches the list of legs for the selected market
  const fetchLegs = async () => {
    const response = await fetch(
      `http://cms.bettorlogic.com/api/BetBuilder/GetSelections?sports=1`
    );
    const data = await response.json();
    setLegs(data);
    console.log("legs", data);
  };

  // Fetches the bets for the selected match, market, and leg
  const fetchBets = async () => {
    const response = await fetch(
      `http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${selectedMatch.id}&marketId=${selectedMarket.id}&legs=${selectedLeg}&language=en`
    );
    const data = await response.json();
    setBets(data);
    console.log("bets", data);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchMatches();
    }
  }, [selectedDate]);

 
  useEffect(() => {
    if (selectedMatch) {
      fetchMarkets();
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (selectedMarket) {
      fetchLegs();
    }
  }, [selectedMarket]);

  useEffect(() => {
    if (selectedLeg) {
      fetchBets();
    }
  }, [selectedLeg]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedMatch(null);
    setSelectedMarket(null);
    setSelectedLeg(null);
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setSelectedMarket(null);
    setSelectedLeg(null);
  };

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setSelectedLeg(null);
  };

  const handleLegSelect = (leg) => {
    setSelectedLeg(leg);
  };

  return (
    <div>
    <div><Header/></div>
    <header style={{ marginTop: "60px" }}>
      {dates.map((date) => (
        <button key={date} onClick={() => handleDateSelect(date)}>
          {date}
        </button>
      ))}
    </header>

    <div>
      {matches.map((match) => (
        <div key={match.id} onClick={() => handleMatchSelect(match)}>
          <p>{match.team1} vs {match.team2}</p>
          <p>Kick-off: {match.datetime}</p>
        </div>
      ))}
    </div>

    {selectedMatch && (
      <div>
        {markets.map((market) => (
          <div key={market.id} onClick={() => handleMarketSelect(market)}>
            <p>Market: {market.name}</p>
          </div>
        ))}
      </div>
    )}

    {selectedMarket && (
      <div>
        {legs.map((leg) => (
          <div key={leg.id} onClick={() => handleLegSelect(leg.id)}>
            <p>Leg: {leg.name}</p>
          </div>
        ))}
      </div>
    )}

    {selectedLeg && (
      <div>
        {bets.map((bet) => (
          <div key={bet.id}>
            <p>Bet: {bet.name}</p>
            {/* Display additional bet information */}
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default Test;


   
