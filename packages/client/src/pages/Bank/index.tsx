import { GameEntity, IGameStatePlayer } from "@monopoly-money/game-state";
import React from "react";
import "./Bank.scss";
import InitialiseGame from "./InitialiseGame";
import PlayerPassedGo from "./PlayerPassedGo";
import ValuePlayerForm from "./ValuePlayerForm";

interface IBankProps {
  players: IGameStatePlayer[];
  hasATransactionBeenMade: boolean;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const Bank: React.FC<IBankProps> = ({
  players,
  hasATransactionBeenMade,
  proposeTransaction
}) => {
  return (
    <div className="bank pb-4">
      {!hasATransactionBeenMade && (
        <div className="mb-3">
          <InitialiseGame players={players} proposeTransaction={proposeTransaction} />
        </div>
      )}

      <div className="card p-3 mb-3">
        <PlayerPassedGo
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, value)
          }
        />
      </div>

      <div className="card p-3 mb-3">
        <ValuePlayerForm
          label="Give Money To Player"
          submitText="Send"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, value)
          }
        />
      </div>

      <div className="card p-3 mb-3">
        <ValuePlayerForm
          label="Take Money From Player"
          submitText="Take"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction(playerId, "bank", value)
          }
        />
      </div>
    </div>
  );
};

export default Bank;
