import type { TransitionFunction } from "react";
import {
  startTransition as reactStartTransition,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useForceUpdate } from "@mantine/hooks";
import type { NextRouter } from "next/router";

let suspendersCount = 0;
const observers = new Set<() => void>();

let didCaptureNewState: ((value?: PromiseLike<void> | void) => void) | null =
  null;

function suspendViewTransitionCapture(): void {
  suspendersCount++;
}

function resumeViewTransitionCapture(): void {
  !--suspendersCount;
  observers.forEach((observer) => observer());
}

const areViewTransitionsSupported =
  typeof globalThis.document?.startViewTransition === "function";

function useBlockRendering(blocked: boolean): void {
  const forceRender = useForceUpdate();
  if (blocked) {
    const deadline = performance.now() + 1;
    while (performance.now() < deadline) {
      // Do nothing. Busy wait to make sure react rerenders.
    }
  }
  useEffect(() => {
    if (blocked) forceRender();
  });
}

type TransitionState =
  | "idle"
  | "capturing-old"
  | "capturing-new"
  | "animating"
  | "skipped";

export function useViewTransition(): {
  resumeViewTransitionCapture: () => void;
  transitionState: TransitionState;
  startViewTransition: (
    updateCallback?: React.TransitionFunction,
  ) => PromiseLike<void> | void;
  suspendViewTransitionCapture: () => void;
} {
  const [transitionState, setTransitionState] =
    useState<TransitionState>("idle");
  useSyncExternalStore(
    (onStoreChange) => {
      observers.add(onStoreChange);
      return () => {
        observers.delete(onStoreChange);
      };
    },
    () => suspendersCount,
    () => 0,
  );

  useEffect(() => {
    if (didCaptureNewState && !suspendersCount) {
      didCaptureNewState();
      didCaptureNewState = null;
    }
  });

  useBlockRendering(transitionState === "capturing-old");

  function startViewTransition(
    updateCallback?: TransitionFunction,
  ): PromiseLike<void> | void {
    // Fallback to simply running the callback soon.
    if (!areViewTransitionsSupported) {
      if (updateCallback) reactStartTransition(updateCallback);
      return;
    }

    suspendViewTransitionCapture();
    setTransitionState("capturing-old");
    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          setTransitionState("capturing-new");
          resumeViewTransitionCapture();
          if (updateCallback) updateCallback();
          didCaptureNewState = resolve;
        }),
    );

    void transition.finished.then(() => {
      setTransitionState("idle");
    });

    transition.ready
      .then(() => {
        setTransitionState("animating");
      })
      .catch((e) => {
        console.error(e);
        setTransitionState("skipped");
      });
  }

  return {
    transitionState,
    startViewTransition,
    suspendViewTransitionCapture,
    resumeViewTransitionCapture,
  };
}

export function useNextRouterViewTransitions({ events }: NextRouter): void {
  const {
    startViewTransition,
    suspendViewTransitionCapture,
    resumeViewTransitionCapture,
  } = useViewTransition();

  useEffect(() => {
    function beginNavigation(
      _url: string,
      { shallow }: { shallow: boolean },
    ): void {
      console.log("beginNavigation", shallow);
      if (shallow) return;

      void startViewTransition();
      suspendViewTransitionCapture();
    }

    function endNavigation(
      _url: string,
      { shallow }: { shallow: boolean },
    ): void {
      if (shallow) return;
      resumeViewTransitionCapture();
    }

    events.on("routeChangeStart", beginNavigation);
    events.on("routeChangeComplete", endNavigation);
    return () => {
      events.off("routeChangeStart", beginNavigation);
      events.off("routeChangeComplete", endNavigation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
