import { View } from "react-native";
import { NotificationList } from "../../src/components/NotificationList";
import styled from 'styled-components/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  shadow-opacity: 0.1;
  margin-bottom: 24px;
`;

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <StyledView style={{ paddingTop: insets.top }}>
      <NotificationList />
    </StyledView>
  );
}
