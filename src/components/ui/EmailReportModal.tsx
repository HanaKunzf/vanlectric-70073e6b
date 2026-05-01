import { NotifyModal } from "./NotifyModal";

interface EmailReportModalProps {
  open: boolean;
  onClose: () => void;
}

export const EmailReportModal = ({ open, onClose }: EmailReportModalProps) => (
  <NotifyModal open={open} onClose={onClose} />
);
