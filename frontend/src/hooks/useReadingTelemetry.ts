import { useState, useEffect, useRef, useCallback } from 'react';
import { TelemetryLogEntry } from '../types';
import { api } from '../services/api';

interface UseReadingTelemetryProps {
  unitId: number;
  currentPage: number;
  totalPages: number;
  isOpen: boolean;
}

export function useReadingTelemetry({
  unitId,
  currentPage,
  isOpen
}: UseReadingTelemetryProps) {
  const [log, setLog] = useState<TelemetryLogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [activeDwellSeconds, setActiveDwellSeconds] = useState(0);

  const sessionIdRef = useRef<number | null>(null);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const pendingDwellRef = useRef<number>(0);
  const pageRef = useRef<number>(currentPage);
  pageRef.current = currentPage;

  const pushLog = useCallback((event: string, pageNum: number) => {
    const timeStr = new Date().toLocaleTimeString('en-GB');
    setLog(prev => [{ timestamp: timeStr, event, page: pageNum }, ...prev.slice(0, 24)]);
  }, []);

  // Flush pending telemetry batch to API
  const flushTelemetry = useCallback((eventType: string, pageNum: number, dwellDelta: number = 0) => {
    if (!isOpen) return;
    api.sendTelemetry(unitId, sessionIdRef.current, [
      {
        event_type: eventType,
        page_number: pageNum,
        dwell_delta_seconds: dwellDelta
      }
    ]);
  }, [isOpen, unitId]);

  // Handle session open and close
  useEffect(() => {
    if (isOpen) {
      pushLog('OPEN', currentPage);
      flushTelemetry('OPEN', currentPage);
    } else {
      pushLog('CLOSE', currentPage);
      flushTelemetry('CLOSE', currentPage, pendingDwellRef.current);
      pendingDwellRef.current = 0;
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page transitions
  const prevPageRef = useRef<number>(currentPage);
  useEffect(() => {
    if (!isOpen) return;

    if (prevPageRef.current !== currentPage) {
      // Leave previous page
      pushLog('PAGE_LEAVE', prevPageRef.current);
      flushTelemetry('PAGE_LEAVE', prevPageRef.current, pendingDwellRef.current);
      pendingDwellRef.current = 0;

      // Enter new page
      pushLog('PAGE_ENTER', currentPage);
      flushTelemetry('PAGE_ENTER', currentPage);
      prevPageRef.current = currentPage;
    }
  }, [currentPage, isOpen, flushTelemetry, pushLog]);

  // Visibility and idle handling
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        pushLog('BLUR', pageRef.current);
        flushTelemetry('BLUR', pageRef.current, pendingDwellRef.current);
        pendingDwellRef.current = 0;
      } else {
        setIsPaused(false);
        lastActiveTimestampRef.current = Date.now();
        pushLog('FOCUS', pageRef.current);
        flushTelemetry('FOCUS', pageRef.current);
      }
    };

    const handleUserInteraction = () => {
      lastActiveTimestampRef.current = Date.now();
      if (isPaused && !document.hidden) {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction);

    // Active timer tick (every 1 second)
    const interval = setInterval(() => {
      if (document.hidden) return;

      // Check idle (if no interaction for > 60s, pause)
      const idleSec = (Date.now() - lastActiveTimestampRef.current) / 1000;
      if (idleSec > 60) {
        if (!isPaused) {
          setIsPaused(true);
          pushLog('IDLE_PAUSE', pageRef.current);
        }
        return;
      }

      // Active tick
      setActiveDwellSeconds(prev => prev + 1);
      pendingDwellRef.current += 1;

      // Flush batch every 15 seconds
      if (pendingDwellRef.current >= 15) {
        flushTelemetry('DWELL_TICK', pageRef.current, pendingDwellRef.current);
        pendingDwellRef.current = 0;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [isOpen, isPaused, flushTelemetry, pushLog]);

  return {
    log,
    isPaused,
    activeDwellSeconds,
    pushManualEvent: pushLog
  };
}
