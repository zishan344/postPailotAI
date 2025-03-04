import { View } from "react-native";
import { NotificationList } from "../../src/components/NotificationList";
import { styled } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StyledView = styled(View);

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <StyledView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <NotificationList />
    </StyledView>
  );
}
