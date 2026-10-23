import { navigate } from "hookrouter";
import { DateTime } from "luxon";
import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import useStoredGames from "../../hooks/useStoredGames";
import bannerImage from "../../img/banner.png";
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
    <div className="home text-center">
      <h1 className="sr-only">Monopoly Money</h1>
      <img src={bannerImage} className="banner" alt="Monopoly Money Banner" />

      <p className="lead mt-2">
        An easy way to manage finances in your game of monopoly from the browser.
      </p>

      <div className="new-join-button-wrapper mt-4">
        <Button size="lg" onClick={newGame}>
          New Game
        </Button>
        <Button size="lg" onClick={joinGame}>
          Join Game
        </Button>
      </div>

      <div className="mt-4">
        <h2>Your Active Games</h2>
        {storedGames.length > 0 ? (
          <div className="active-game-cards">
            {storedGames
              .sort((a, b) => (a.time > b.time ? -1 : 1))
              .map(({ gameId, userToken, playerId, status, time }) => (
                <Card key={gameId} className="mb-1">
                  <Card.Body className="p-2">
                    <div className="text-left">
                      Game {gameId}
                      <small style={{ float: "right" }}>
                        {DateTime.fromISO(time).toFormat("DD h:mm a")}
                      </small>
                    </div>
                    <div>
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
                            className="mr-1"
                          >
                            {player.name}: {formatCurrency(player.balance)}
                          </Badge>
                        ))}
                    </div>
                    <Button
                      block
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onGameSetup(gameId, userToken, playerId)}
                      className="mt-2"
                    >
                      Join Game
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>You have no active games</div>
        )}
      </div>
    </div>
  );
};

export default Home;
