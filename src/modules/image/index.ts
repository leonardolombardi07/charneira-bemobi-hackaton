interface BreakpointColumnMap {
  // Values should be between 1 and 12
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export function calculateSizesFromColumns(
  breakpointColumnMap: BreakpointColumnMap
) {
  const breakpointValues = heuristicallyGetBreakpointsMaxWidths();
  const totalWidth = 100;

  const lastBreakpoint = Object.keys(
    breakpointColumnMap
  ).pop() as keyof BreakpointColumnMap;

  const sizes = Object.entries(breakpointColumnMap).map(
    ([breakpoint, columns]) => {
      const roundedWidth = Math.round(totalWidth / columns);

      if (breakpoint === lastBreakpoint) {
        return `${roundedWidth}vw`;
      }

      return `(max-width: ${
        breakpointValues[breakpoint as keyof typeof breakpointValues]
      }px) ${roundedWidth}vw`;
    }
  );

  return sizes.join(", ");
}

type RequiredBreakpointColumnMap = Required<BreakpointColumnMap>;

type BreakpointValues = {
  [K in keyof RequiredBreakpointColumnMap]: number;
};

export function heuristicallyGetBreakpointsMaxWidths(): BreakpointValues {
  // Leo: Breakpoints are part of the theme. The dimensions we need are used at build time, so I don't think we can use the theme here. That's why this is heuristical.
  return {
    xs: 600,
    sm: 900,
    md: 1200,
    lg: 1600,
  };
}
