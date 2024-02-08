import { Card, Text, Title, Tooltip } from "@mantine/core";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export const OverviewCard = ({
  thisMonth,
  previousMonth,
  label,
  money,
}: {
  thisMonth: number | undefined;
  previousMonth: number | undefined;
  label: string;
  money?: boolean;
}) => {
  return (
    <Card shadow={"lg"}>
      <Title order={6}>{label}</Title>
      <Title order={2}>
        {money
          ? Intl.NumberFormat("nl-NL", {
              style: "currency",
              currency: "EUR",
            }).format(thisMonth ?? 0)
          : thisMonth ?? 0}
      </Title>
      {thisMonth !== undefined &&
        previousMonth !== undefined &&
        !(thisMonth === 0 && previousMonth === 0) && (
          <Tooltip label={"Previous month: " + previousMonth}>
            <Text
              className={"flex items-center gap-x-1"}
              c={thisMonth < previousMonth ? "green" : "red"}
            >
              {thisMonth < previousMonth ? (
                <>
                  <TrendingDownIcon className={"h-5 w-5"} />
                  {thisMonth === 0
                    ? 100
                    : Math.floor(
                        ((previousMonth - thisMonth) / thisMonth) * 100,
                      )}
                  %
                </>
              ) : (
                <>
                  <TrendingUpIcon className={"mb-1 h-5 w-5"} />
                  {previousMonth === 0
                    ? 100
                    : Math.floor(
                        ((thisMonth - previousMonth) / previousMonth) * 100,
                      )}
                  %
                </>
              )}
            </Text>
          </Tooltip>
        )}
    </Card>
  );
};
