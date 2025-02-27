import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Button, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

interface MediaPickerProps {
  onImagesChange?: (images: string[]) => void;
}

export const MediaPicker = ({ onImagesChange }: MediaPickerProps) => {
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newImages]);
      onImagesChange?.([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <IconButton
              icon="close-circle"
              size={20}
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            />
          </View>
        ))}
      </ScrollView>
      <Button
        mode="outlined"
        onPress={pickImages}
        icon="image-plus"
        style={styles.addButton}>
        Add Media
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  imageContainer: {
    marginRight: 8,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: "white",
  },
  addButton: {
    marginTop: 8,
  },
});
