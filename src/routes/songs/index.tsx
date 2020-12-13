import { AppTitle, AppTitleBar, Back, Refresh } from "../../components";
import React from "react";
import { ActorRefFrom, StateMachine } from "xstate";

export const Songs = ({
  service
}: {
  service: ActorRefFrom<StateMachine<any, any, any>>;
}) => (
  <AppTitleBar>
    <Back />
    <AppTitle>My List</AppTitle> <Refresh onRefresh={() => {}} />
  </AppTitleBar>
);
