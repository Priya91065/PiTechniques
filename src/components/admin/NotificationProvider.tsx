"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { Alert, Snackbar, type AlertColor } from "@mui/material";

type NotifyFn = (message: string, severity?: AlertColor) => void;

const NotificationContext = createContext<NotifyFn>(() => undefined);

/** Toast notifications, available anywhere in the admin via `useNotify()`. */
export function useNotify(): NotifyFn {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback<NotifyFn>((message, severity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={() => setState((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
