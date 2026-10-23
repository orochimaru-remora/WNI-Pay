import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, Form } from "react-bootstrap";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";
import { formatCurrency } from "../../utils";

interface IValuePlayerFormProps {
  label: string;
  submitText: string;
  players: IGameStatePlayer[];
  onSubmit: (value: number, playerId: string) => void;
}

const ValuePlayerForm: React.FC<IValuePlayerFormProps> = ({
  label,
  submitText,
  players,
  onSubmit
}) => {
  const identifier = label.toLowerCase().replace(" ", "-");
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than Rp0");
    } else if (!Number.isInteger(amount)) {
      setSubmitError("The amount must be a whole number");
    } else if (selectedPlayer === null) {
      setSubmitError("No player is selected");
    } else {
      onSubmit(amount, selectedPlayer.playerId);
      setAmount(null);
      setSelectedPlayer(null);
      setSubmitError(null);
    }
  };

  return (
    <>
      <label htmlFor={identifier} className="mb-2 font-weight-bold">
        {label}
      </label>

      <MonopolyAmountInput amount={amount} setAmount={setAmount} id={identifier} />

      <div className="quick-amount-group mt-2">
        {[100000, 500000, 1000000, 2000000, 4000000].map((quickVal) => (
          <Button
            key={quickVal}
            variant="outline-secondary"
            size="sm"
            className="quick-chip-btn"
            onClick={() => setAmount((amount ?? 0) + quickVal)}
          >
            +{formatCurrency(quickVal)}
          </Button>
        ))}
        {amount !== null && amount > 0 && (
          <Button
            variant="outline-danger"
            size="sm"
            className="quick-chip-btn"
            onClick={() => setAmount(null)}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="mt-3 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id={`${identifier}-player`}
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button variant={submitText === "Take" ? "danger" : "success"} onClick={submit}>
          {submitText}
        </Button>
      </div>

      <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
    </>
  );
};

export default ValuePlayerForm;
