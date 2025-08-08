import React from "react";

export function ClientOnlyDate({ date }: { date: Date }) {
  const [formattedDate, setFormattedDate] = React.useState<string>("");

  React.useEffect(() => {
    setFormattedDate(date.toLocaleDateString("th-TH"));
  }, [date]); 

  return <div>{formattedDate}</div>;
}
