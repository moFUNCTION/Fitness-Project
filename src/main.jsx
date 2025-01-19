import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { UserDataContextProvder } from "./Context/UserDataContextProvider/UserDataContextProvder.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider
        theme={extendTheme({
          direction: "rtl",
          components: {
            Skeleton: {
              fadeDuration: "3",
              defaultProps: {
                fadeDuration: "3",
              },
            },
          },
        })}
      >
        <UserDataContextProvder>
          <App />
        </UserDataContextProvder>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
