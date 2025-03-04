import { useState } from "react";
import { View } from "react-native";
import { FAB, Portal, Modal } from "react-native-paper";
import styled from 'styled-components/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostScheduler } from "../../src/components/scheduler/PostScheduler";
import { ScheduledPostsList } from "../../src/components/scheduler/ScheduledPostsList";
import { useSchedulerStore } from "../../src/stores/schedulerStore";

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export default function SchedulerScreen() {
  const insets = useSafeAreaInsets();
  const [showScheduler, setShowScheduler] = useState(false);
  const { fetchScheduledPosts } = useSchedulerStore();

  // Fetch scheduled posts when the screen mounts
  useState(() => {
    fetchScheduledPosts();
  }, []);

  return (
    <StyledView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScheduledPostsList />

      <Portal>
        <Modal
          visible={showScheduler}
          onDismiss={() => setShowScheduler(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 8,
            padding: 16,
          }}>
          <PostScheduler />
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: insets.bottom,
        }}
        onPress={() => setShowScheduler(true)}
      />
    </StyledView>
  );
}
