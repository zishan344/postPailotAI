import styled from 'styled-components/native';
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocialAccountsManager } from '../../../src/components/social/SocialAccountsManager';

const StyledView = styled(View)`
  flex: 1;
  background-color: white;
  padding: 4px;
`;

const StyledText = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 2px;
  color: gray;
`;

const StyledScrollView = styled(ScrollView)`
  flex: 1;
  background-color: white;
`;

export default function SocialAccountsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <StyledScrollView style={{ paddingTop: insets.top }}>
      <StyledView>
        <StyledText>Social Accounts</StyledText>
        <StyledText>Connect your social media accounts to schedule and publish posts</StyledText>
      </StyledView>
      <SocialAccountsManager />
    </StyledScrollView>
  );
}
