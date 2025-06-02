"use client";

import {createContext, useContext, ReactNode} from "react";
import {TooltipProps} from "recharts";

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const ChartContext = createContext<ChartConfig | null>(null);

export function ChartContainer({
  config,
  children,
}: {
  config: ChartConfig;
  children: ReactNode;
}) {
  return (
    <ChartContext.Provider value={config}>
      {" "}
      <style jsx global>{`
        :root {
          --chart-1: 221 83% 53%;
          --chart-2: 142 76% 36%;
          --chart-3: 30 100% 50%;
        }
      `}</style>
      <div className="chart-container">{children}</div>
    </ChartContext.Provider>
  );
}

export function useChartConfig() {
  const config = useContext(ChartContext);
  if (!config) {
    throw new Error("useChartConfig must be used within a ChartContainer");
  }
  return config;
}

interface ChartTooltipContentProps extends TooltipProps<number, string> {
  indicator?: "line" | "dot";
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "line",
}: ChartTooltipContentProps) {
  const config = useChartConfig();

  if (!active || !payload || !config || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="text-xs font-medium">{label}</div>
      <div className="mt-1 flex flex-col gap-0.5">
        {payload.map((item, index) => {
          const key = item.dataKey as string;
          const data = config[key];

          if (!data) return null;

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {indicator === "line" ? (
                  <div
                    className="h-0.5 w-3 rounded-full"
                    style={{backgroundColor: data.color}}
                  />
                ) : (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{backgroundColor: data.color}}
                  />
                )}
              </div>
              <span className="text-xs font-medium tabular-nums">
                {data.label}: {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartTooltip = ({children}: {children?: ReactNode}) => children;
