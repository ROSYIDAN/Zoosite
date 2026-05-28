"use client";

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  useEffect(() => {
    // Intercept console.error and console.warn to suppress strict-mode warnings
    // caused by legacy lifecycle methods inside swagger-ui-react's third-party components (e.g., ParameterRow).
    const originalError = console.error;
    const originalWarn = console.warn;

    const isLegacyLifecycleWarning = (msg: any) =>
      typeof msg === 'string' &&
      (msg.includes('UNSAFE_componentWillReceiveProps') ||
        msg.includes('componentWillReceiveProps') ||
        msg.includes('unsafe-component-lifecycles'));

    console.error = (...args) => {
      if (isLegacyLifecycleWarning(args[0]) || isLegacyLifecycleWarning(args[1])) {
        return; // Suppress
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (isLegacyLifecycleWarning(args[0]) || isLegacyLifecycleWarning(args[1])) {
        return; // Suppress
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
