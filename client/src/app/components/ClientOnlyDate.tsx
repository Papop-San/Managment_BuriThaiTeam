import React from "react";

export function ClientOnlyDate({ date }: { date: Date | string }) {
  const [formattedDate, setFormattedDate] = React.useState<string>("");

  React.useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    setFormattedDate(d.toLocaleDateString("th-TH"));
  }, [date]);

  return <div>{formattedDate}</div>;
}