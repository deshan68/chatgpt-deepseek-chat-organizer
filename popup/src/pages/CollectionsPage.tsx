import {
  Button,
  Dialog,
  DropdownMenu,
  Em,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "../hooks/UseReduxType";
import { goBack } from "../slices/navigationSlice";
import { ChevronLeftIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import CollectionCard from "../components/CollectionCard";
import { useState } from "react";
import { getFilteredCollection } from "../utils/utils";
import UseDatabase from "../hooks/UseDatabase";

const CollectionsPage = () => {
  const dispatch = useAppDispatch();
  const { collections, insertCollection } = UseDatabase();

  const currentScreen = useAppSelector(
    (state) => state.navigation.currentScreen
  );
  const themeColor = useAppSelector((state) => state.config.themeColor);
  const urlType = useAppSelector((state) => state.config.urlType);
  const his = useAppSelector((state) => state.navigation.history);

  const [collectionName, setCollectionName] = useState<string>("");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] =
    useState<boolean>(false);

  const handleCreateCollection = () => {
    insertCollection(collectionName);
    setCollectionName("");
    setIsCollectionDialogOpen(false);
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
        <Text
          size="1"
          weight="regular"
          style={{ flex: 1, textAlign: "center" }}
        >
          {currentScreen.title}
        </Text>

        <Flex
          style={{
            flex: 1,
            justifyContent: "end",
          }}
        >
          {currentScreen.title === "All Collections" && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <DotsHorizontalIcon
                  style={{
                    backgroundColor: "#ffff",
                    borderRadius: 10,
                    padding: 1,
                    border: `0.5px solid ${themeColor}`,
                  }}
                  color={themeColor}
                  height={12}
                  width={12}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="1" color="gray" variant="soft">
                <DropdownMenu.Item
                  onClick={() => setIsCollectionDialogOpen(true)}
                >
                  New Collection
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
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
        {getFilteredCollection(collections, urlType).length === 0 ? (
          <Text size="1" weight="medium" style={{ textAlign: "center" }}>
            <Flex gapX="1" align="center" direction={"row"} justify={"center"}>
              <Em>Click above</Em>
              <DotsHorizontalIcon
                style={{
                  backgroundColor: "#ffff",
                  borderRadius: 10,
                  padding: 1,
                  border: `0.5px solid ${themeColor}`,
                }}
                color={themeColor}
                height={12}
                width={12}
              />
              <Em>to create New Collection</Em>
            </Flex>
          </Text>
        ) : (
          <>
            {getFilteredCollection(collections, urlType).map((l) => (
              <CollectionCard
                id={l.id}
                name={l.name}
                chats={l.chats}
                date={l.date}
                isFavorite={l.isFavorite}
                key={l.id}
              />
            ))}
          </>
        )}
      </Flex>

      <Dialog.Root open={isCollectionDialogOpen}>
        <Dialog.Content maxWidth="450px">
          <Flex direction="column" gap="3">
            <label>
              <Text size="1" mb="1">
                Collection Name
              </Text>
              <TextField.Root
                size="1"
                placeholder="Enter collection name"
                value={collectionName}
                onChange={(e) => {
                  if (e.target.value.length <= 30) {
                    setCollectionName(e.target.value);
                  }
                }}
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="soft"
              color="gray"
              size="1"
              onClick={() => setIsCollectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="1"
              color="gray"
              highContrast
              onClick={handleCreateCollection}
            >
              Create
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};

export default CollectionsPage;
