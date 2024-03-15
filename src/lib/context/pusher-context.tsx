/**
 * Section 1: "The Store"
 *
 * This defines a Pusher client and channel connection as a vanilla Zustand store.
 */

import Pusher, { Channel, PresenceChannel } from "pusher-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { env } from "~/env";

const pusher_key = env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusher_server_tls = env.NEXT_PUBLIC_PUSHER_SERVER_TLS;
const pusher_server_cluster = env.NEXT_PUBLIC_PUSHER_CLUSTER;

interface PusherZustandStore {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
}

const createPusherStore = (slug: string) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher;
    pusherClient.connect();
  } else {
    pusherClient = new Pusher(pusher_key, {
      enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
      forceTLS: pusher_server_tls === 'true',
      cluster: pusher_server_cluster,
    });
  }

  const channel = pusherClient.subscribe(slug);

  const presenceChannel = pusherClient.subscribe(
    `presence-${slug}`,
  ) as PresenceChannel;

  const store = createStore<PusherZustandStore>(() => {
    return {
      pusherClient: pusherClient,
      channel: channel,
      presenceChannel,
    };
  });

  return store;
};

/**
 * Section 2: "The Context Provider"
 *
 * This creates a "Zustand React Context" that we can provide in the component tree.
 */

const PusherZustandStoreContext = createContext<
  (() => StoreApi<PusherZustandStore>) | null
>(null);

/**
 * This provider is the thing you mount in the app to "give access to Pusher"
 *
 */
export const PusherProvider: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ slug, children }) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(slug);
    updateStore(newStore);
    return () => {
      const pusher = newStore.getState().pusherClient;
      console.log("disconnecting pusher and destroying store", pusher);
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)",
      );
      pusher.disconnect();
    };
  }, [slug]);

  if (!store) return null;

  return (
    <PusherZustandStoreContext.Provider value={() => store}>
      {children}
    </PusherZustandStoreContext.Provider>
  );
};

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 *
 * (I really want useEvent tbh)
 */
export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void,
) {
  const createStore = useContext(
    PusherZustandStoreContext,
  ) as () => StoreApi<PusherZustandStore>;
  const channel = useStore(createStore(), (state) => state.channel);

  const stableCallback = React.useRef(callback);

  // Keep callback sync'd
  React.useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}
