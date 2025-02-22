import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "./screens/HomeScreen"
import AdminScreen from "./screens/AdminScreen"
import UserScreen from "./screens/UserScreen"
import FormCreationScreen from "./screens/FormCreationScreen"
import FormEditScreen from "./screens/FormEditScreen"
import FormCompletionScreen from "./screens/FormCompletionScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="FormCreation" component={FormCreationScreen} />
        <Stack.Screen name="FormEdit" component={FormEditScreen} />
        <Stack.Screen name="FormCompletion" component={FormCompletionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

