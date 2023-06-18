import React, { useState, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import '../Css/MatchDetails.css';
import { useLocation, useNavigate } from 'react-router-dom';

function MatchDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchData = location.state;
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedLeg, setSelectedLeg] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [legs, setLegs] = useState([]);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedMatch(matchData);
  }, [matchData]);

  const fetchMarkets = async () => {
    try {
      const response = await fetch(
        'http://cms.bettorlogic.com/api/BetBuilder/GetMarkets?sports=1'
      );
      const data = await response.json();
      setMarkets(data);
    } catch (error) {
      console.error('Error fetching markets:', error);
    }
  };

  const fetchLegs = async () => {
    try {
      const response = await fetch(
        'http://cms.bettorlogic.com/api/BetBuilder/GetSelections?sports=1'
      );
      const data = await response.json();
      setLegs(data);
    } catch (error) {
      console.error('Error fetching legs:', error);
    }
  };

  useEffect(() => {
    fetchLegs();
  }, []);

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

  const handleSelectionChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleLegChange = (event) => {
    setSelectedLeg(event.target.value);
  };

  useEffect(() => {
    if (selectedMatch && selectedMarket && selectedLeg) {
      fetchBets();
    }
  }, [selectedMatch, selectedMarket, selectedLeg]);

  const fetchBets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${selectedMatch.MatchId}&marketId=${selectedMarket}&legs=${selectedLeg}&language=en`
      );
      const data = await response.json();
      setBets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bets:', error);
      setError('Error fetching bets. Please try again later.');
      setLoading(false);
    }
  };

  const handelBackClick = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="detailsCon">
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="selections">
              <div className="selectionItem">
                <span className="selectionLabel">Selections:</span>
                <select
                  value={selectedMarket}
                  onChange={handleSelectionChange}
                >
                  <option value="">Select Market</option>
                  {markets.map((market) => (
                    <option key={market.id} value={market.MarketId}>
                      {market.MarketName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="legs">
              <div className="legsItem">
                <span className="legsLabel">Legs:</span>
                <select value={selectedLeg} onChange={handleLegChange}>
                  <option value="">Select Leg</option>
                  {legs.map((leg) => (
                    <option key={leg.selectionValue} value={leg.selectionValue}>
                      {leg.selectionValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : bets.length > 0 ? (
            <div>
              <h1>fsfsd</h1>
              {bets.map((bet) => (
                <div key={bet.MatchId}>
                  <p>Bet: {bet.TotalOdds}</p>
                  {bet.BetBuilderSelections && Array.isArray(bet.BetBuilderSelections) ? (
                    <div>
                      {bet.BetBuilderSelections.map((selection) => (
                        <div key={selection.Id}>
                          <p>Key Status: {selection.RTB}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No selections found for this bet.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No bets available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;
