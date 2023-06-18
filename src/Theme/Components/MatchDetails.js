import React, { useState, useEffect } from 'react';
import Header from '../Container/Header';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import '../Css/MatchDetails.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSelections, fetchBetBuilderBets } from '../ApiServices/index';

function MatchDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchData = location.state;
  // console.log(matchData);


  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedLeg, setSelectedLeg] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [legs, setLegs] = useState([]);
  const [bets, setBets] = useState([]);



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


  const fetchBets = async () => {
    try {
      const response = await fetch(
        `http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${selectedMatch.MatchId}&marketId=${selectedMarket}&legs=${selectedLeg}&language=en`
      );
      const data = await response.json();
      const arrayBets = [data]
      setBets(arrayBets);
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  };
  useEffect(() => {
    console.log('Bets builder:', bets);
  }, [bets])

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



  const handelBackClick = () => {
    navigate('/');
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="detailsCon">
        <div>
          <div style={{ alignItems: 'flex-start', display: 'flex', paddingLeft: '200px', marginBottom: "15px", }}>
            <BsFillArrowLeftCircleFill style={{ color: 'red', fontSize: 30, cursor:"pointer" }} onClick={handelBackClick} />
          </div>
          <div style={{ backgroundColor: 'red', marginBottom: "15px", paddingLeft: '200px' }}>
            <span style={{ alignItems: 'flex-start', display: 'flex', fontSize: 24, fontWeight: 'bolder', padding: '10px', color: "white" }} > Make It A Bet Builder </span>
          </div>
          <div style={{ display: 'flex', marginBottom: "15px" }}>
            <div style={{ backgroundColor: 'black', width: '40%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
              <span style={{ color: 'white', fontSize: 24, fontWeight: 'bolder', paddingLeft: "200px" }}>
                {matchData.MatchDate}
              </span>
            </div>
            <div style={{ backgroundColor: 'red', width: '60%', padding: "3px",  float: 'left',transform: 'skew(-20deg)',transformOrigin: '0 0',}}>
              <span
                style={{ color: 'white', paddingLeft: '0px', fontSize: 24, fontWeight: 'bolder', }}>
                {matchData.MatchName}<br /> {matchData.Country}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="selections">
              <div className="selectionItem">
                <span className="selectionLabel">Selections:</span>
                <select className="selectionDropdown" value={selectedMarket} onChange={handleSelectionChange}>
                  <option value="">Select Market</option>
                  {markets.map((market, i) => (
                    <option key={i + 1} value={market.MarketId}>
                      {market.MarketName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="legs">
              <div className="legsItem">
                <span className="legsLabel">Legs:</span>
                <select className="legsDropdown" value={selectedLeg} onChange={handleLegChange}>
                  <option value="">Select Leg</option>
                  {legs.map((leg, i) => (
                    <option key={i + 1} value={leg.selectionValue}>
                      {leg.selectionValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className='table'>
            {bets && Array.isArray(bets) && bets.length > 0 ? (
              <>
                <p style={{ color: 'black', fontSize:19 }}>
                  TotalOdds: <span style={{ color: 'red' }}>{bets[0].TotalOdds}</span>
                </p>
                <div className="table-container">

                  <table className="bet-table">
                    <thead>
                      <tr>
                        <th style={{ color: "red" }}>Sr. No.</th>
                        <th style={{ color: "red" }}>Key Stats</th>
                        <th style={{ color: "red" }}>Market</th>
                        <th style={{ color: "red" }}>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((bet, index) =>
                        bet.BetBuilderSelections && Array.isArray(bet.BetBuilderSelections) ? (
                          bet.BetBuilderSelections.map((selection, subIndex) => (
                            <tr key={bet.MatchId + index + subIndex}>
                              <td>{subIndex + 1}</td>
                              <td>{selection.RTB}</td>
                              <td>{selection.Market}</td>
                              <td>{selection.Selection}</td>
                            </tr>
                          ))
                        ) : (
                          <tr key={bet.MatchId}>
                            <td colSpan="4">No selections found for this bet.</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>

            ) : (
              <div>
                <h2>Select Above Information</h2>
              </div>
            )}

          </div>




        </div>
      </div>
    </div>
  );
}

export default MatchDetails;


