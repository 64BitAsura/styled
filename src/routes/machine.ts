import { Machine, assign, spawn, StateMachine, ActorRefFrom } from "xstate";
import {
  createMovieMachine,
  MovieEvent,
  MovieMachineContext
} from "./movies/movieMachine";

interface MyListMachineSchema {
  states: {
    idle: {};
    selected: {};
  };
}

type MyListEvent = { type: "SELECT"; name: string };

interface MyListContext {
  subLists: {
    [subList: string]: ActorRefFrom<
      StateMachine<MovieMachineContext, any, MovieEvent>
    > | null;
  };
  subList: ActorRefFrom<
    StateMachine<MovieMachineContext, any, MovieEvent>
  > | null;
}

const createSubListMachine = (subList: string) => {
  switch (subList) {
    case "movies":
      return spawn(createMovieMachine());
    default:
      return null;
  }
};

export const MyListMachine = Machine<
  MyListContext,
  MyListMachineSchema,
  MyListEvent
>({
  id: "myList",
  initial: "idle",
  context: {
    subLists: {},
    subList: null
  },
  states: {
    idle: {},
    selected: {}
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign((context, event) => {
        let subList = context.subLists[event.name];
        if (subList) {
          return {
            ...context,
            subList
          };
        }
        subList = createSubListMachine(event.name);
        return {
          subLists: {
            ...context.subLists,
            ...(() => (subList ? { [event.name]: subList } : {}))()
          },
          subList
        };
      })
    }
  }
});
