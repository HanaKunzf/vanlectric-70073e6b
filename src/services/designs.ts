// Saved designs service stub. Phase 3.
import type { WizardState } from "@/types";

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: string;
  state: WizardState;
}

export const designsService = {
  async list(): Promise<SavedDesign[]> {
    return [];
  },
  async save(_name: string, _state: WizardState): Promise<SavedDesign | null> {
    return null;
  },
  async load(_id: string): Promise<SavedDesign | null> {
    return null;
  },
  async remove(_id: string): Promise<boolean> {
    return false;
  },
};
