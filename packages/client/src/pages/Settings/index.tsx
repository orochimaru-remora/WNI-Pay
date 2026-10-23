import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import {
  formatCurrency,
  sortPlayersByName,
  trackNewPlayersAllowed,
  trackNewPlayersNotAllowed,
  trackShowOppositionBalancesDisabled,
  trackShowOppositionBalancesEnabled
} from "../../utils";
import DeletePlayerModal from "./DeletePlayerModal";
import EndGameConfirmDialog from "./EndGameConfirmDialog";
import RenamePlayerModal from "./RenamePlayerModal";
import "./Settings.scss";

interface ISettingsProps {
  isGameOpen: boolean;
  showOppositionBalances: boolean;
  players: IGameStatePlayer[];
  proposePlayerNameChange: (playerId: string, name: string) => void;
  proposePlayerDelete: (playerId: string) => void;
  proposeGameOpenStateChange: (open: boolean) => void;
  proposeShowOppositionBalancesChange: (showOppositionBalances: boolean) => void;
  proposeGameEnd: () => void;
}

const Settings: React.FC<ISettingsProps> = ({
  isGameOpen,
  showOppositionBalances,
  players,
  proposePlayerNameChange,
  proposePlayerDelete,
  proposeGameOpenStateChange,
  proposeShowOppositionBalancesChange,
  proposeGameEnd
}) => {
  const [actioningPlayer, setActioningPlayer] = useState<IGameStatePlayer | null>(null);
  const [showNameChangeModal, hideNameChangeModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <RenamePlayerModal
            player={actioningPlayer}
            proposePlayerNameChange={proposePlayerNameChange}
            onClose={hideNameChangeModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showDeletePlayerModal, hideDeletePlayerModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <DeletePlayerModal
            player={actioningPlayer}
            proposePlayerDelete={proposePlayerDelete}
            onClose={hideDeletePlayerModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showEndGameConfirmModal, hideEndGameConfirmModal] = useModal(
    () => (
      <>
        <EndGameConfirmDialog proposeGameEnd={proposeGameEnd} onClose={hideEndGameConfirmModal} />
      </>
    ),
    [actioningPlayer]
  );

  const toggleShowOppositionBalances = () => {
    if (showOppositionBalances) {
      trackShowOppositionBalancesDisabled();
    } else {
      trackShowOppositionBalancesEnabled();
    }
    proposeShowOppositionBalancesChange(!showOppositionBalances);
  };

  const toggleNewPlayersAllowed = () => {
    if (isGameOpen) {
      trackNewPlayersNotAllowed();
    } else {
      trackNewPlayersAllowed();
    }
    proposeGameOpenStateChange(!isGameOpen);
  };

  return (
    <div className="settings pb-4">
      <div className="card p-3 mb-3">
        <h5 className="mb-3">Players</h5>
        <Table hover responsive size="sm" className="mb-0">
          <thead>
            <tr>
              <th style={{ width: "36px" }}></th>
              <th>Name</th>
              <th>Balance</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortPlayersByName(players).map((player) => (
              <tr key={player.playerId} className="player-row">
                <td className="text-center">
                  <ConnectedStateDot connected={player.connected} />
                </td>
                <td className="font-weight-bold">{player.name}</td>
                <td>{formatCurrency(player.balance)}</td>
                <td className="text-right">
                  <div className="d-inline-flex" style={{ gap: "0.4rem" }}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      title="Rename"
                      onClick={() => {
                        setActioningPlayer(player);
                        showNameChangeModal();
                      }}
                    >
                      <span role="img" aria-label="Rename">
                        ✏️
                      </span>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      title="Remove"
                      onClick={() => {
                        setActioningPlayer(player);
                        showDeletePlayerModal();
                      }}
                    >
                      <span role="img" aria-label="Remove">
                        🗑️
                      </span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="card p-3">
        <h5 className="mb-3">Game Controls</h5>
        <div className="settings-actions-grid">
          <Button block variant="info" onClick={toggleShowOppositionBalances}>
            {showOppositionBalances ? "Hide" : "Show"} Opposition Balances
          </Button>

          <Button block variant="primary" onClick={toggleNewPlayersAllowed}>
            {isGameOpen ? "Close" : "Open"} Game To New Players
          </Button>
        </div>

        <hr className="my-3" />

        <Button block variant="danger" onClick={() => showEndGameConfirmModal()}>
          End Game
        </Button>
      </div>
    </div>
  );
};

export default Settings;
