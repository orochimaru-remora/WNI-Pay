import { navigate } from "hookrouter";
import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { createGame, joinGame } from "../../api";
import Config from "../../config";
import useStoredGames from "../../hooks/useStoredGames";
import { getGameIdFromQueryString, trackGameCreated, trackGameJoined } from "../../utils";

interface IJoinProps {
  newGame: boolean;
  onGameSetup: (gameId: string, userToken: string, playerId: string) => void;
}

const Join: React.FC<IJoinProps> = ({ newGame, onGameSetup }) => {
  const title = newGame ? "Create Game" : "Join Game";

  const { storedGames } = useStoredGames(false);
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(getGameIdFromQueryString() ?? "");
  const [name, setName] = useState("");
  const [gameError, setGameError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [hasServerError, setHasServerError] = useState(false);

  // If the game is already stored, join with what we have
  const isAStoredGame = storedGames.map((g) => g.gameId).indexOf(gameId) !== -1;

  const onSubmit = () => {
    if (isAStoredGame) {
      const storedGame = storedGames.find((g) => g.gameId === gameId)!;
      onGameSetup(storedGame.gameId, storedGame.userToken, storedGame.playerId);
    } else if (newGame) {
      // Validity check
      if (name === "") {
        setNameError("Please provide your name");
        return;
      }
      setNameError(null);

      // Create game
      setLoading(true);
      createGame(name)
        .then((result) => {
          onGameSetup(result.gameId, result.userToken, result.playerId);
          trackGameCreated();
        })
        .catch((error) => {
          console.log(error);
          setHasServerError(true);
        })
        .finally(() => setLoading(false));
    } else {
      // Validity check
      if (gameId === "") {
        setGameError("Please provide the game Id");
        return;
      }
      setGameError(null);
      if (name === "") {
        setNameError("Please provide your name");
        return;
      }
      setNameError(null);

      // Join game
      setLoading(true);
      joinGame(gameId, name)
        .then((result) => {
          if (result === "DoesNotExist") {
            setGameError("That game does not exist");
          } else if (result === "NotOpen") {
            setGameError("That game is not open. Ask the banker to open the game.");
          } else {
            onGameSetup(result.gameId, result.userToken, result.playerId);
            trackGameJoined();
          }
        })
        .catch((error) => {
          console.log(error);
          setHasServerError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div style={{ maxWidth: "440px", margin: "1.5rem auto" }}>
      <Card className="p-4 text-center">
        <h2 className="mb-3">{title}</h2>

        {!newGame && (
          <Form.Group className="text-left">
            <Form.Label className="font-weight-bold">Game ID</Form.Label>
            <NumberFormat
              allowNegative={false}
              format="######"
              placeholder="123456"
              value={gameId}
              onValueChange={({ value }: NumberFormatValues) => setGameId(value)}
              className="form-control text-center"
              style={{ fontSize: "1.15rem", letterSpacing: "0.1em" }}
              autoComplete="off"
              inputMode="decimal"
            />
            {gameError && (
              <Form.Text style={{ color: "var(--danger)" }} className="mt-1">
                {gameError}
              </Form.Text>
            )}
          </Form.Group>
        )}

        {isAStoredGame ? (
          <p className="my-3">
            <em>You're already in this game - name is not required.</em>
          </p>
        ) : (
          <Form.Group className="text-left">
            <Form.Label className="font-weight-bold">Your Name</Form.Label>
            <Form.Control
              placeholder="Enter your name"
              value={name}
              className="text-center"
              onChange={(e) => setName(e.currentTarget.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                event.key === "Enter" && onSubmit()
              }
              autoComplete="on"
            />
            {nameError && (
              <Form.Text style={{ color: "var(--danger)" }} className="mt-1">
                {nameError}
              </Form.Text>
            )}
          </Form.Group>
        )}

        <div
          className="mt-4"
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.65rem" }}
        >
          <Button variant="outline-secondary" onClick={() => navigate("/")} disabled={loading}>
            ← Back
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={loading}>
            {newGame ? "Create Game →" : "Join Game →"}
          </Button>
        </div>

        {hasServerError && (
          <p style={{ color: "var(--danger)" }} className="mt-3 mb-0">
            {Config.api.unreachableErrorMessage.split("\n").map((line, i, arr) => (
              <React.Fragment key={line}>
                {line}
                {i !== arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        )}
      </Card>
    </div>
  );
};

export default Join;
