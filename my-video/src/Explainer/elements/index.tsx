import React from "react";
import type { Element } from "../types";
import { Bars, BigNumber, DotGrid, LineChart, Versus } from "./charts";
import { Levels, Reps, Steps, Week } from "./progress";
import { Brain, Lever } from "./science";
import { ButtonEl, Callout, Card, Comments } from "./ui";

export const ElementView: React.FC<{ e: Element }> = ({ e }) => {
  switch (e.type) {
    case "dotGrid":
      return <DotGrid e={e} />;
    case "bars":
      return <Bars e={e} />;
    case "lineChart":
      return <LineChart e={e} />;
    case "reps":
      return <Reps e={e} />;
    case "week":
      return <Week e={e} />;
    case "steps":
      return <Steps e={e} />;
    case "card":
      return <Card e={e} />;
    case "comments":
      return <Comments e={e} />;
    case "button":
      return <ButtonEl e={e} />;
    case "callout":
      return <Callout e={e} />;
    case "levels":
      return <Levels e={e} />;
    case "bigNumber":
      return <BigNumber e={e} />;
    case "brain":
      return <Brain e={e} />;
    case "lever":
      return <Lever e={e} />;
    case "versus":
      return <Versus e={e} />;
  }
};
