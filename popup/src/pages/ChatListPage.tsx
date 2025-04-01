import { CaretDownIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Em, Flex, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import ChatCard from "../components/ChatCard";
import { Chat } from "../../../shared/types";
import UseDatabase from "../hooks/UseDatabase";
import { useConfirmation } from "../context/ConfirmationContext";
import { isCurrentChatFound } from "../utils/utils";

const ChatListPage = () => {
  const dispatch = useAppDispatch();

  const {
    filteredCollections,
    filteredChats,
    insertChat,
    setAsFavorite,
    deleteCollection,
  } = UseDatabase();
  const { showConfirmation } = useConfirmation();

  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const his = useAppSelector((state) => state.navigation.history);
  const collectionId = currentScreen?.params?.collectionId || null;
  const currentChatDetails = useAppSelector(
    (state) => state.config.currentChatDetails
  );

  const themeColor = useAppSelector((state) => state.config.themeColor);
  const tagId = currentScreen?.params?.tagId || null;

  const getShortTxt = (text: string): string => {
    let shortedTxt = text.slice(0, 13);
    if (text.length > 13) shortedTxt += "...";
    return shortedTxt;
  };

  const getChatsByCollectionId = (): Chat[] => {
    const filteredIds = filteredCollections.find(
      (c) => c.id === collectionId
    )?.chats;
    const _filteredChats = filteredChats.filter((c) =>
      filteredIds?.includes(c.id)
    );
    return _filteredChats;
  };

  const getChatsByTagId = (): Chat[] => {
    return filteredChats.filter((c) => c.tags.includes(tagId));
  };

  const getChatList = (): Chat[] => {
    if (collectionId) return getChatsByCollectionId();
    if (tagId) return getChatsByTagId();

    return filteredChats;
  };

  const getFavoriteStatus = (): boolean => {
    const isFavorite = filteredCollections.find(
      (c) => c.id === collectionId
    )!.isFavorite;
    return isFavorite;
  };

  const handleDeleteCollection = () => {
    showConfirmation({
      title: "Delete Collection",
      message: "Are you sure you want to delete this collection?",
      onConfirm: () => {
        deleteCollection(collectionId);
        dispatch(goBack());
      },
    });
  };

  if (!currentScreen) {
    return <div>No screen to display</div>;
  }

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      {/* header */}
      <Flex my="4" px="4" justify={"center"} align={"center"}>
        <Flex
          onClick={() => dispatch(goBack())}
          style={{ cursor: "pointer", flex: 1 }}
          gapX="1"
          align="center"
        >
          <Flex>
            <ChevronLeftIcon color={themeColor} />
          </Flex>
          <Text
            size="1"
            weight="regular"
            style={{
              color: themeColor,
            }}
          >
            {his[his.length - 1].title}
          </Text>
        </Flex>

        <Flex
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            columnGap: 3,
          }}
        >
          <Text size="1" weight="regular" style={{ textAlign: "center" }}>
            {getShortTxt(currentScreen.title)}
          </Text>
          {collectionId && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <CaretDownIcon
                  style={{ backgroundColor: "#E3E3E8", borderRadius: 10 }}
                  height={12}
                  width={12}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="1" color="gray" variant="soft">
                {/* <DropdownMenu.Item>Rename</DropdownMenu.Item> */}
                <DropdownMenu.Item
                  disabled={
                    getChatsByCollectionId().some(
                      (c) => c.chatUrl === currentChatDetails.chatUrl
                    ) || !isCurrentChatFound(currentChatDetails)
                  }
                  onClick={() => insertChat(collectionId)}
                >
                  Save Current Chat
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => setAsFavorite(collectionId)}>
                  {getFavoriteStatus() ? "Remove From Favorite" : "Favorite"}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => handleDeleteCollection()}
                  color="red"
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>

        <Flex style={{ flex: 1, height: 3 }} />
      </Flex>

      <Flex
        gapY="2"
        px="4"
        direction={"column"}
        style={{
          overflowY: "scroll",
          height: "550px",
        }}
      >
        {getChatList().length === 0 ? (
          <Text size="1" weight="medium" style={{ textAlign: "center" }}>
            <Flex gapX="1" align="center" direction={"row"} justify={"center"}>
              <Em>Click above</Em>
              <CaretDownIcon
                style={{ backgroundColor: "#E3E3E8", borderRadius: 10 }}
                height={12}
                width={12}
              />
              <Em>to Save Current Chat</Em>
            </Flex>
            <Em>(Make sure to open a chat.)</Em>
          </Text>
        ) : (
          <>
            {getChatList().map((c) => (
              <ChatCard
                id={c.id}
                date={c.date}
                name={c.name}
                tags={c.tags}
                chatUrl={c.chatUrl}
              />
            ))}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatListPage;
