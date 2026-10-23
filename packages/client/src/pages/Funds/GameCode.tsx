import React, { useRef } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useClipboard } from "use-clipboard-copy";
import useMessageModal from "../../hooks/useMessageModal";
import { getShareGameLink, trackGameCodeClick } from "../../utils";

interface IGameCodeProps {
  gameId: string;
  isBanker: boolean;
}

const GameCode: React.FC<IGameCodeProps> = ({ gameId, isBanker }) => {
  const showMessage = useMessageModal();

  const gameIdClicked = () => {
    showMessage({
      title: "Share game",
      body: <ShareGameModalContent gameId={gameId} />,
      closeButtonText: null
    });
    trackGameCodeClick();
  };

  return (
    <div className="game-code-banner card p-3 mb-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: "0.75rem" }}>
        <div className="text-left">
          <div className="text-muted" style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Game ID
          </div>
          <div
            onClick={gameIdClicked}
            style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1.1, cursor: "pointer" }}
          >
            {gameId}
          </div>
          {isBanker && (
            <small className="text-muted d-block mt-1">
              You can hide this by closing the game in settings
            </small>
          )}
        </div>

        <Button variant="outline-secondary" size="sm" onClick={gameIdClicked}>
          📲 Share / QR Code
        </Button>
      </div>
    </div>
  );
};

interface ShareGameModalContentProps {
  gameId: string;
}

const ShareGameModalContent = ({ gameId }: ShareGameModalContentProps) => {
  const shareLink = getShareGameLink(gameId);

  const clipboard = useClipboard({
    copiedTimeout: 1000
  });
  const copyTooltipTarget = useRef<HTMLButtonElement>(null);

  const copyLink = () => {
    clipboard.copy(shareLink);
  };

  return (
    <>
      <p className="text-center">Get others to scan the code below to join your game</p>
      <div className="mt-4 text-center">
        <QRCode value={shareLink} />
      </div>

      <div className="mt-4">
        <Button block onClick={copyLink} ref={copyTooltipTarget}>
          Copy link to send to others
        </Button>
      </div>

      <Overlay target={copyTooltipTarget.current} show={clipboard.copied} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            Copied to clipboard
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default GameCode;
