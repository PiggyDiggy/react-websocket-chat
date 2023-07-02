import React from "react";

import { Spin } from "../Spin";

type Props = {
  loading: boolean;
};

export const Preloader = ({ children, loading }: React.PropsWithChildren<Props>) => {
  return <>{loading ? <Spin /> : children}</>;
};
