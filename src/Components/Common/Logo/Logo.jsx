import React from "react";
import { LazyLoadedImage } from "../LazyLoadedImage/LazyLoadedImage";
import LogoImage from "../../../Assets/Logo/logo.png";
export const Logo = ({ ...rest }) => {
  return <LazyLoadedImage w="80px" {...rest} src={LogoImage} />;
};
