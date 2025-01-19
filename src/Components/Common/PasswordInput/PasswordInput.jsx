import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { PiEyeClosed } from "react-icons/pi";
import styles from "./styles.module.css";
export const PasswordInput = forwardRef(({ sx, ...rest }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <InputGroup sx={sx}>
      <Input ref={ref} type={show ? "text" : "password"} {...rest} />
      <InputRightAddon
        bgColor="white"
        cursor="pointer"
        onClick={() => setShow(!show)}
        overflow="hidden"
      >
        {show ? (
          <FaEye key={show} className={styles["opacity-animation"]} />
        ) : (
          <PiEyeClosed key={show} className={styles["opacity-animation"]} />
        )}
      </InputRightAddon>
    </InputGroup>
  );
});
PasswordInput.displayName = "PasswordInput";
