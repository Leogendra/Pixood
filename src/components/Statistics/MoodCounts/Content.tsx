import { Text, View } from "react-native";
import useColors from "@/hooks/useColors";
import { NUMBER_OF_RATINGS } from "@/constants/Config";
import { Bar } from "./Bar";

export const Content = ({
  data,
}: {
  data: {
    values: {
      [key: number]: number;
    };
    total: number;
  };
}) => {
  const colors = useColors();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottomColor: colors.cardBorder,
          borderBottomWidth: 1,
          paddingHorizontal: 16,
          marginTop: 16,
        }}
      >
        {Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i).map((ratingValue) => (
          <Bar
            key={`rating-bar-${ratingValue}`}
            height={data.values[ratingValue] / data.total * 400}
            ratingValue={ratingValue} />
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingHorizontal: 16,
        }}
      >
        {Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i).map((ratingValue) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              flex: NUMBER_OF_RATINGS,
              marginHorizontal: 2,
            }}
            key={`rating-count-${ratingValue}`}
          >
            <Text
              key={`text-${ratingValue}`}
              style={{
                width: '100%',
                marginTop: 8,
                color: colors.text,
                opacity: data.values[ratingValue] === 0 ? 0.3 : 1,
                textAlign: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >{data.values[ratingValue]}x</Text>
          </View>
        ))}
      </View>
    </>
  );
};
