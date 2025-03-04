import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { styled } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SocialAccountsManager } from "../../../src/components/social/SocialAccountsManager";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function SocialAccountsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <StyledScrollView
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}>
      <StyledView className="p-4">
        <StyledText className="text-2xl font-semibold mb-2">
          Social Accounts
        </StyledText>
        <StyledText className="text-gray-600 mb-6">
          Connect your social media accounts to schedule and publish posts
        </StyledText>
      </StyledView>

      <SocialAccountsManager />
    </StyledScrollView>
  );
}
