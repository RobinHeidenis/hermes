import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { Button, Code, Loader, Text, Title } from "@mantine/core";
import Barcode from "react-barcode";
import { modals } from "@mantine/modals";
import { PencilIcon, StoreIcon, Trash2Icon } from "lucide-react";
import { openEditLoyaltyCardModal } from "~/components/modals/EditLoyaltyCardModal";

const LoyaltyCardModal = ({
  workspaceId,
  card,
}: {
  workspaceId: string;
  card: RouterOutputs["workspace"]["getWorkspace"]["loyaltyCards"][number];
}) => {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.loyaltyCard.deleteLoyaltyCard.useMutation({
    onMutate: () => {
      utils.workspace.getWorkspace.setData({ workspaceId }, (data) => {
        if (!data) return data;

        return {
          ...data,
          loyaltyCards: data.loyaltyCards.filter((c) => c.id !== card.id),
        };
      });
    },
    onSuccess: () => modals.closeAll(),
    onSettled: () => utils.workspace.getWorkspace.invalidate({ workspaceId }),
  });

  return (
    <div className={"flex flex-col items-center px-16 pb-16"}>
      <Title order={3} className={"text-center"}>
        <StoreIcon className={"mb-1.5 mr-2 inline-block h-5 w-5"} />
        {card.store}
      </Title>
      <Title order={4} c={"dimmed"}>
        {card.name}
      </Title>
      <div className={"flex flex-col items-center"}>
        <div className={"mt-5 flex justify-center"}>
          <Barcode value={card.barcode} />
        </div>
        <div
          className={"mt-5 flex w-full flex-row items-center justify-center"}
        >
          <Button
            leftSection={<Trash2Icon className={"h-4 w-4"} />}
            onClick={() => {
              modals.openConfirmModal({
                title: "Delete loyalty card?",
                children: (
                  <Text>
                    Are you sure you want to delete your loyalty card for
                    <Code className={"ml-1 mr-1"}>{card.store}</Code>called
                    <Code className={"ml-1"}>{card.name}</Code>? This action
                    cannot be undone!
                  </Text>
                ),
                labels: {
                  confirm: "Delete",
                  cancel: "Cancel",
                },
                confirmProps: {
                  leftSection: isLoading ? (
                    <Loader size={"xs"} color={"white"} />
                  ) : (
                    <Trash2Icon className={"h-4 w-4"} />
                  ),
                  color: "red",
                },
                onConfirm: () =>
                  mutate({ workspaceId, loyaltyCardId: card.id }),
              });
            }}
            color={"red"}
            className={"w-28"}
          >
            Delete
          </Button>
          <Button
            leftSection={<PencilIcon className={"h-4 w-4"} />}
            onClick={() => {
              modals.closeAll();
              openEditLoyaltyCardModal({ workspaceId, card });
            }}
            className={"ml-10 w-28"}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export const openLoyaltyCardModal = ({
  card,
  workspaceId,
  onClose,
}: {
  card: RouterOutputs["workspace"]["getWorkspace"]["loyaltyCards"][number];
  workspaceId: string;
  onClose?: () => void;
}) => {
  const isMobile = matchMedia("(max-width: 50em)").matches;

  modals.open({
    id: "LoyaltyCardModal",
    children: <LoyaltyCardModal card={card} workspaceId={workspaceId} />,
    size: "auto",
    centered: true,
    fullScreen: isMobile,
    transitionProps: isMobile ? { transition: "slide-up" } : {},
    padding: "xl",
    onClose: onClose,
  });
};
