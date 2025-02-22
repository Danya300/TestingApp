import { View, Button, StyleSheet } from "react-native"

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Admin Mode" onPress={() => navigation.navigate("Admin")} />
      <Button title="User Mode" onPress={() => navigation.navigate("User")} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

