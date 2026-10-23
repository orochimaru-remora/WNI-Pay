import React from "react";
import { Card } from "react-bootstrap";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import { formatCurrency } from "../../utils";

interface IPlayerCardProps {
  name: string;
  connected: boolean | null;
  balance: number | null;
  onClick: () => void;
}

const PlayerCard: React.FC<IPlayerCardProps> = ({ name, connected, balance, onClick }) => {
  return (
    <Card className="player-card" onClick={onClick} role="button" tabIndex={0}>
      <Card.Body className="p-3 d-flex align-items-center justify-content-between">
        <div className="text-left">
          <div className="d-flex align-items-center" style={{ gap: "0.45rem" }}>
            {connected !== null && <ConnectedStateDot connected={connected} />}
            <strong style={{ fontSize: "1.02rem" }}>{name}</strong>
          </div>
          {balance !== null && (
            <div className="text-muted mt-1" style={{ fontSize: "0.92rem", fontWeight: 500 }}>
              {Number.isFinite(balance) ? formatCurrency(balance) : "∞"}
            </div>
          )}
        </div>
        <span className="send-pill-btn">Send →</span>
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;
