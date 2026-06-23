"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(async () => false);

/** Promise-based confirmation dialog, via `const confirm = useConfirm()`. */
export function useConfirm(): ConfirmFn {
  return useContext(ConfirmContext);
}

export default function ConfirmProvider({ children }: { children: ReactNode }): JSX.Element {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ message: "" });
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    setOpts(options);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: boolean): void => {
    setOpen(false);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={open} onClose={() => close(false)}>
        <DialogTitle>{opts.title ?? "Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{opts.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close(false)}>{opts.cancelText ?? "Cancel"}</Button>
          <Button
            onClick={() => close(true)}
            variant="contained"
            color={opts.destructive ? "error" : "primary"}
            autoFocus
          >
            {opts.confirmText ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
