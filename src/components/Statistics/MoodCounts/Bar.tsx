import { View } from "react-native";
import { NUMBER_OF_RATINGS } from "@/constants/Config";
import useScale from "@/hooks/useScale";


export const Bar = ({
  height, ratingValue,
}) => {
  const { colors: scale } = useScale();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        flex: NUMBER_OF_RATINGS,
        marginHorizontal: 2,
      }}
    >
      <View
        style={{
          height,
          width: '100%',
          backgroundColor: scale[ratingValue].background,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }} />
    </View>
  );
};
