import { NotifyModal } from "./NotifyModal";

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProModal = ({ open, onClose }: ProModalProps) => (
  <NotifyModal open={open} onClose={onClose} />
);
