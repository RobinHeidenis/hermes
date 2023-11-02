import { ActionIcon, Loader, Menu } from "@mantine/core";
import {
  CheckIcon,
  MoreVerticalIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import { api } from "~/utils/api";
import { modals } from "@mantine/modals";
import { openListSettingsModal } from "~/components/modals/ListSettingsModal";

export const ListMenu = ({
  listId,
  checkedItems,
  items,
  workspaceId,
  currentUserIsOwner,
}: {
  listId: string;
  checkedItems: boolean;
  items: boolean;
  workspaceId: string;
  currentUserIsOwner: boolean;
}) => {
  const utils = api.useUtils();
  const { mutate: deleteCheckedItems, isLoading: isDeleteCheckedItemsLoading } =
    api.list.deleteCheckedItems.useMutation({
      onMutate: async () => {
        await utils.list.getList.cancel({ listId });
        utils.list.getList.setData({ listId }, (data) => {
          if (!data) return data;

          return {
            ...data,
            items: data.items.filter((item) => !item.checked),
          };
        });
      },
      onSettled: () => utils.list.getList.invalidate({ listId }),
    });
  const { mutate: deleteAllItems, isLoading: isDeleteAllItemsLoading } =
    api.list.deleteAllItems.useMutation({
      onMutate: async () => {
        await utils.list.getList.cancel({ listId });
        utils.list.getList.setData({ listId }, (data) => {
          if (!data) return data;

          return {
            ...data,
            items: [],
          };
        });
      },
      onSettled: () => utils.list.getList.invalidate({ listId }),
    });

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          variant={"subtle"}
          color={"gray"}
          size={"lg"}
          className={"ml-3"}
        >
          <MoreVerticalIcon className={"h-4 w-4"} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {currentUserIsOwner && (
          <>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              leftSection={<SettingsIcon className={"h-4 w-4"} />}
              onClick={() => openListSettingsModal({ listId, workspaceId })}
            >
              List settings
            </Menu.Item>
          </>
        )}
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          leftSection={
            isDeleteCheckedItemsLoading ? (
              <Loader size={"xs"} color={"lightgray"} />
            ) : (
              <CheckIcon className={"h-4 w-4"} />
            )
          }
          color={"orange"}
          disabled={!checkedItems}
          onClick={() => {
            modals.openConfirmModal({
              title: "Delete checked items?",
              children: "Are you sure you want to delete all checked items?",
              labels: {
                confirm: "Delete",
                cancel: "Cancel",
              },
              confirmProps: {
                color: "red",
                leftSection: <Trash2Icon className={"h-5 w-5"} />,
              },
              onConfirm: () => deleteCheckedItems({ listId }),
            });
          }}
        >
          Delete checked items
        </Menu.Item>
        <Menu.Item
          leftSection={
            isDeleteAllItemsLoading ? (
              <Loader size={"xs"} color={"lightgray"} />
            ) : (
              <Trash2Icon className={"h-4 w-4"} />
            )
          }
          color={"orange"}
          disabled={!items}
          onClick={() => {
            modals.openConfirmModal({
              title: "Delete all items?",
              children: "Are you sure you want to delete all items?",
              labels: {
                confirm: "Delete",
                cancel: "Cancel",
              },
              confirmProps: {
                color: "red",
                leftSection: <Trash2Icon className={"h-5 w-5"} />,
              },
              onConfirm: () => deleteAllItems({ listId }),
            });
          }}
        >
          Delete all items
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
