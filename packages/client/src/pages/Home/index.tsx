import { navigate } from "hookrouter";
import { DateTime } from "luxon";
import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import useStoredGames from "../../hooks/useStoredGames";
import logoImage from "../../img/logo.jpg";
import { formatCurrency } from "../../utils";
import "./Home.scss";

interface IHomeProps {
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Home: React.FC<IHomeProps> = ({ onGameSetup }) => {
  const { storedGames } = useStoredGames();

  const newGame = () => navigate("/new-game");
  const joinGame = () => navigate("/join");

  return (
    <div className="home text-center pb-4">
      <h1 className="sr-only">WNI Simulator</h1>
      <div className="hero-section">
        <img
          src={logoImage}
          className="banner mt-2"
          alt="WNI Simulator Logo"
          style={{ maxHeight: "220px", width: "auto", borderRadius: "12px" }}
        />

        <div className="new-join-button-wrapper mt-4">
          <Button size="lg" variant="primary" onClick={newGame}>
            <span>➕</span> New Game
          </Button>
          <Button size="lg" variant="dark" onClick={joinGame}>
            <span>🔑</span> Join Game
          </Button>
        </div>
      </div>

      <div className="mt-5 active-games-section">
        <h4 className="mb-3">Your Active Games</h4>
        {storedGames.length > 0 ? (
          <div className="active-game-cards">
            {storedGames
              .sort((a, b) => (a.time > b.time ? -1 : 1))
              .map(({ gameId, userToken, playerId, status, time }) => (
                <Card key={gameId} className="active-game-card">
                  <Card.Body className="p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong style={{ fontSize: "1.05rem" }}>Game #{gameId}</strong>
                        <small className="text-muted">
                          {DateTime.fromISO(time).toFormat("DD h:mm a")}
                        </small>
                      </div>
                      <div className="player-badges-list mb-3">
                        {status?.players
                          .sort((p1, _p2) => (p1.playerId === playerId ? -1 : 0))
                          .map((player) => (
                            <Badge
                              key={player.playerId}
                              variant={
                                player.playerId === playerId
                                  ? "dark"
                                  : player.banker
                                  ? "info"
                                  : "success"
                              }
                              className="player-badge"
                            >
                              {player.name}: {formatCurrency(player.balance)}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <Button
                      block
                      size="sm"
                      variant="primary"
                      onClick={() => onGameSetup(gameId, userToken, playerId)}
                    >
                      Join Game →
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div className="empty-games-state p-3">You have no active games</div>
        )}
      </div>
    </div>
  );
};

export default Home;
