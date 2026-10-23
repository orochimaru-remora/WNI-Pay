import { IGameStatePlayer } from "@monopoly-money/game-state";
import useLocalStorage from "@rehooks/local-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Modal
} from "react-bootstrap";
import { useModal } from "react-modal-hook";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { formatCurrency } from "../../utils";

const passingGoRewardValueLocalStorageKey = "playersSalaryValue";

interface IPlayerPassedGoProps {
  players: IGameStatePlayer[];
  onSubmit: (value: number, playerId: string) => void;
}

const PlayerPassedGo: React.FC<IPlayerPassedGoProps> = ({ players, onSubmit }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [storedPassingGoReward, setStoredPassingGoReward] = useLocalStorage<number>(
    passingGoRewardValueLocalStorageKey,
    1000000
  );
  const [passingGoReward, setPassingGoReward] = useState<number>(storedPassingGoReward ?? 1000000);

  const [updatePassingGoRewardModalValue, setUpdatePassingGoRewardModalValue] =
    useState<number>(passingGoReward);
  const [showUpdatePassingGoRewardModal, hideUpdatePassingGoRewardModal] = useModal(
    () => (
      <Modal show={true} onHide={hideUpdatePassingGoRewardModal} size="lg" centered>
        <Modal.Header
          closeButton
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          placeholder={undefined}
        >
          <Modal.Title>Update Player's Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Amount</InputGroup.Text>
            </InputGroup.Prepend>
            <NumberFormat
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp"
              value={updatePassingGoRewardModalValue}
              onValueChange={({ value }: NumberFormatValues) => {
                setUpdatePassingGoRewardModalValue(parseInt(value, 10));
              }}
              className="form-control"
              autoComplete="off"
              decimalScale={0}
              inputMode="decimal"
            />
            <Button
              variant="success"
              onClick={() => {
                setPassingGoReward(updatePassingGoRewardModalValue);
                hideUpdatePassingGoRewardModal();
              }}
              className="remove-left-border-radius"
            >
              Set
            </Button>
          </InputGroup>
          <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
        </Modal.Body>
      </Modal>
    ),
    [updatePassingGoRewardModalValue, setUpdatePassingGoRewardModalValue]
  );

  // Update stored value when passingGoReward is changed
  useEffect(() => {
    setStoredPassingGoReward(passingGoReward);
  }, [passingGoReward]);

  const submit = () => {
    if (selectedPlayer !== null) {
      onSubmit(passingGoReward, selectedPlayer.playerId);
      setSelectedPlayer(null);
      setSubmitError(null);
    } else {
      setSubmitError("No player selected");
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label htmlFor="player-passed-go" className="mb-0 font-weight-bold">
          Player's Salary ({formatCurrency(passingGoReward)})
        </label>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={showUpdatePassingGoRewardModal}
          title="Edit Salary Amount"
        >
          ⚙️ Edit
        </Button>
      </div>

      <div className="mt-1 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id="player-passed-go"
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button variant="success" onClick={submit}>
          Give
        </Button>
      </div>

      <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
    </>
  );
};

export default PlayerPassedGo;
