import { View } from "react-native";
import {
  Text,
  Button,
  Card,
  Avatar,
  IconButton,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialMediaService } from "../../services/socialMediaService";
import { createInteropElement } from "react-native-css-interop";
const StyledView = createInteropElement(View, {});
const StyledText = createInteropElement(Text, {});

export function SocialAccountsManager() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: socialMediaService.getConnectedAccounts,
  });

  const disconnectMutation = useMutation({
    mutationFn: socialMediaService.disconnectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });

  const handleConnect = async (platform: "twitter" | "linkedin") => {
    try {
      if (platform === "twitter") {
        await socialMediaService.connectTwitter();
      } else {
        await socialMediaService.connectLinkedIn();
      }
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    }
  };

  return (
    <StyledView className="p-4">
      <StyledText className="text-xl font-semibold mb-4">
        Connected Accounts
      </StyledText>

      <Card className="mb-4">
        <Card.Content>
          {accounts?.map((account) => (
            <StyledView
              key={account.id}
              className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <StyledView className="flex-row items-center">
                <Avatar.Image
                  size={40}
                  source={{ uri: account.profile_image_url }}
                />
                <StyledView className="ml-3">
                  <StyledText className="font-medium">
                    {account.username}
                  </StyledText>
                  <StyledText className="text-gray-600 text-sm">
                    {account.platform}
                  </StyledText>
                </StyledView>
              </StyledView>

              <IconButton
                icon="link-off"
                size={20}
                onPress={() => disconnectMutation.mutate(account.platform)}
              />
            </StyledView>
          ))}

          {!accounts?.length && (
            <StyledText className="text-gray-500 text-center py-4">
              No accounts connected
            </StyledText>
          )}
        </Card.Content>
      </Card>

      <StyledText className="text-lg font-medium mb-3">Add Account</StyledText>

      <StyledView className="flex-row gap-4">
        <Button
          mode="outlined"
          onPress={() => handleConnect("twitter")}
          icon={() => (
            <MaterialCommunityIcons
              name="twitter"
              size={20}
              color={theme.colors.primary}
            />
          )}>
          Connect Twitter
        </Button>

        <Button
          mode="outlined"
          onPress={() => handleConnect("linkedin")}
          icon={() => (
            <MaterialCommunityIcons
              name="linkedin"
              size={20}
              color={theme.colors.primary}
            />
          )}>
          Connect LinkedIn
        </Button>
      </StyledView>
    </StyledView>
  );
}
