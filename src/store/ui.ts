"use client";
import { create } from "zustand";

type UiState = {
	loadingMessage: string | null;
	toast: { type: "success" | "error"; message: string } | null;
	setLoading: (msg: string | null) => void;
	setToast: (toast: UiState["toast"]) => void;
};

export const useUiStore = create<UiState>((set) => ({
	loadingMessage: null,
	toast: null,
	setLoading: (loadingMessage) => set({ loadingMessage }),
	setToast: (toast) => set({ toast }),
}));
