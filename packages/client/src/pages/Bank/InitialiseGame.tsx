import { GameEntity, IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";
import { formatCurrency, trackInitialisedPlayerBalances } from "../../utils";

interface IInitialiseGameProps {
  players: IGameStatePlayer[];
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const InitialiseGame: React.FC<IInitialiseGameProps> = ({ players, proposeTransaction }) => {
  const [showModal, hideModal] = useModal(() => (
    <ValueModal
      submitAmount={(amount: number) => {
        players.forEach((p) => {
          proposeTransaction("bank", p.playerId, amount);
        });
      }}
      onClose={hideModal}
    />
  ));

  return (
    <Button variant="primary" block onClick={showModal}>
      Initialise Player Balances
    </Button>
  );
};

interface IValueModalProps {
  submitAmount: (amount: number) => void;
  onClose: () => void;
}

const ValueModal: React.FC<IValueModalProps> = ({ submitAmount, onClose }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than Rp0");
    } else {
      submitAmount(amount);
      close();
      trackInitialisedPlayerBalances(amount);
    }
  };

  const close = () => {
    setAmount(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal show={true} onHide={close} size="lg" centered className="send-money-modal">
      <Modal.Header
        closeButton
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        placeholder={undefined}
      >
        <Modal.Title>Initialise Balances</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Once you give a player money or initialise balances, you can not initialise balances
          again.
        </p>

        <MonopolyAmountInput amount={amount} setAmount={setAmount} autoFocus={true} />

        <div className="quick-amount-group mt-3">
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

        <Button block variant="success" size="lg" className="mt-3" onClick={submit}>
          Initialise
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;
