import React, { useState, useEffect } from 'react';
import Header from '../Container/Header';
import '../Css/Home.css';
import { fetchFixtures, fetchMarkets, fetchSelections, fetchBetBuilderBets } from '../ApiServices/index';
import { useNavigate } from 'react-router-dom';

const convertToLocalDate = (utcDate) => {
  const date = new Date(utcDate);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleString(); // Adjust format as needed
};

function Home() {
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [matches, setMatches] = useState([]);

  const fetchDates = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dateArray = [];

    while (today <= nextWeek) {
      const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      dateArray.push(formattedDate);
      today.setDate(today.getDate() + 1);
    }

    setDates(dateArray);
  };

  const fetchMatches = async () => {
    const data = await fetchFixtures(selectedDate);
    const filteredMatches = data.filter((match) => {
      const matchDate = new Date(match.MatchDate);
      const selectedDateTime = new Date(selectedDate);
      return matchDate.toDateString() === selectedDateTime.toDateString();
    });
    const convertedMatches = filteredMatches.map((match) => ({
      ...match,
      datetime: convertToLocalDate(match.datetime),
    }));
    setMatches(convertedMatches);
    localStorage.setItem('matches', JSON.stringify(convertedMatches));
  };

  useEffect(() => {
    fetchDates();
    const storedMatches = JSON.parse(localStorage.getItem('matches'));
    if (storedMatches) {
      setMatches(storedMatches);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchMatches();
    }
  }, [selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleMatchSelect = (match) => {
    navigate('/details', { state: match });
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="content">
        <div className="homeHeader">
          <header className="headerDate">
            {dates.map((date) => (
              <div
                className={`headerDateMap ${selectedDate === date ? 'active' : ''}`}
                key={date}
                onClick={() => handleDateClick(date)}
                style={{ backgroundColor: selectedDate === date ? 'green' : '#f4f4f4' }}
              >
                {date}
              </div>
            ))}
          </header>
        </div>

        {matches && matches.length > 0 ? (
          <div className="matchesContainer">
            <div className="displayMatch">
              {matches.map((match, index) => (
                <div key={match.MatchId} onClick={() => handleMatchSelect(match)}>
                  {index === 0 || matches[index - 1].Country !== match.Country ? (
                    <div>
                      {index !== 0}
                      <p style={{ backgroundColor: 'red', padding: 10, fontSize: 19 }}>{match.Country}</p>
                    </div>
                  ) : null}
                  <p>{match.Team1Name} {match.MatchTime} {match.Team2Name}
                    {index !== matches.length - 1 && (
                      <hr style={{ display: matches[index + 1].Country !== match.Country ? 'none' : 'block' }} />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2>Select the Date</h2>
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;

