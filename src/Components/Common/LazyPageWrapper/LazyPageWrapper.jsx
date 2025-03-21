import React, { Suspense } from "react";
import { CenteredCircularProgress } from "../CenteredCircularProgress/CenteredCircularProgress";
import { Progress, Stack } from "@chakra-ui/react";

export const LazyPageWrapper = ({
  children,
  Loader = <CenteredCircularProgress />,
}) => {
  return (
    <Suspense
      fallback={
        <Stack>
          <Progress
            pos="fixed"
            top="0"
            w="100%"
            size="xs"
            h="5px"
            isIndeterminate
          />
          {Loader}
        </Stack>
      }
    >
      {children}
    </Suspense>
  );
};
