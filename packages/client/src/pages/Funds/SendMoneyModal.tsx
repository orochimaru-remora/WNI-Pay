import { GameEntity, IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";
import { bankName, freeParkingName } from "../../constants";
import { formatCurrency } from "../../utils";

interface ISendMoneyModalProps {
  balance: number;
  playerId: string;
  recipient: "freeParking" | "bank" | IGameStatePlayer;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  onClose: () => void;
}

const SendMoneyModal: React.FC<ISendMoneyModalProps> = ({
  balance,
  playerId,
  recipient,
  proposeTransaction,
  onClose
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than Rp0");
    } else if (!Number.isInteger(amount)) {
      setSubmitError("The amount must be a whole number");
    } else if (amount > balance) {
      setSubmitError(`You do not have enough money (${formatCurrency(balance)})`);
    } else {
      proposeTransaction(
        playerId,
        recipient === "freeParking" || recipient === "bank" ? recipient : recipient.playerId,
        amount
      );
      close();
    }
  };

  const close = () => {
    setAmount(null);
    setSubmitError(null);
    onClose();
  };

  const getRecipientName = () => {
    if (recipient === "freeParking") {
      return freeParkingName;
    } else if (recipient === "bank") {
      return bankName;
    } else {
      return recipient.name;
    }
  };

  return (
    <Modal show={true} onHide={close} size="lg" centered className="send-money-modal">
      <Modal.Header
        closeButton
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        placeholder={undefined}
      >
        <Modal.Title>Transfer Funds</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <span
            className="d-inline-block px-3 py-1"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "999px",
              fontWeight: 600,
              border: "1px solid rgba(0,0,0,0.08)"
            }}
          >
            💵 → {getRecipientName()}
          </span>
        </div>

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
          Send
        </Button>

        {submitError && (
          <Form.Text style={{ color: "var(--danger)" }} className="text-center mt-2">
            {submitError}
          </Form.Text>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SendMoneyModal;
