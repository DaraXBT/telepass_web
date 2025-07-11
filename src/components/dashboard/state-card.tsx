import React, {useState, useEffect} from "react";
import {Calendar, Clock, CheckCircle, Users, LucideIcon} from "lucide-react";
import {useLanguage} from "../providers/LanguageProvider";

function getIconStyle(title: string): {bg: string; iconColor: string} {
  switch (title) {
    case "Total Events":
    case "ចំនួនព្រឹត្តិការណ៍សរុប":
      return {
        bg: "rgba(255, 102, 102, 0.1)",
        iconColor: "rgb(255, 102, 102)",
      };
    case "Ongoing Events":
    case "ព្រឹត្តិការណ៍កំពុងដំណើរការ":
      return {
        bg: "rgba(52, 199, 89, 0.1)",
        iconColor: "rgb(52, 199, 89)",
      };
    case "Finished Events":
    case "ព្រឹត្តិការណ៍បានបញ្ចប់":
      return {
        bg: "rgba(255, 149, 0, 0.1)",
        iconColor: "rgb(255, 149, 0)",
      };
    case "Total Users":
    case "អ្នកប្រើប្រាស់សរុប":
      return {
        bg: "rgba(90, 200, 250, 0.1)",
        iconColor: "rgb(90, 200, 250)",
      };
    default:
      return {
        bg: "rgba(142, 142, 147, 0.1)",
        iconColor: "rgb(142, 142, 147)",
      };
  }
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

function StatsCard({title, value, icon: Icon}: StatsCardProps) {
  const {t} = useLanguage();
  const translatedTitle = t(title);
  const {bg, iconColor} = getIconStyle(translatedTitle);
  const [count, setCount] = useState(0);
  const finalValue = parseInt(value);

  useEffect(() => {
    // Reset counter when value changes
    setCount(0);

    // Don't animate if value is not a number
    if (isNaN(finalValue)) {
      setCount(0);
      return;
    }

    // Animation duration in milliseconds (1 second)
    const duration = 1000;
    // Number of steps in the animation
    const steps = 20;
    // Calculate step size
    const stepValue = finalValue / steps;
    // Calculate delay between steps
    const stepDelay = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;

      if (currentStep === steps) {
        // On final step, set to exact value
        setCount(finalValue);
        clearInterval(timer);
      } else {
        // For intermediate steps, increment by step value
        setCount(Math.floor(stepValue * currentStep));
      }
    }, stepDelay);

    return () => clearInterval(timer);
  }, [value, finalValue]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium text-muted-foreground">
            {translatedTitle}
          </p>
          <p className="text-3xl font-bold mt-2 mb-1">
            {isNaN(finalValue) ? value : count}
          </p>
        </div>
        <div
          className="rounded-full p-2 flex items-center justify-center"
          style={{
            backgroundColor: bg,
            width: "40px",
            height: "40px",
          }}>
          <Icon className="h-5 w-5" style={{color: iconColor}} />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const {t} = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Events" value="10" icon={Calendar} />
      <StatsCard title="Ongoing Events" value="5" icon={Clock} />
      <StatsCard title="Finished Events" value="2" icon={CheckCircle} />
      <StatsCard title="Total Users" value="6" icon={Users} />
    </div>
  );
}
