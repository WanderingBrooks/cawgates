'use client';

import { createContext, useContext } from 'react';

type ViewerContextValue = {
  isOwner: boolean;
  isLoggedIn: boolean;
  viewerUsername: string | null;
};

const ViewerContext = createContext<ViewerContextValue>({
  isOwner: true,
  isLoggedIn: false,
  viewerUsername: null,
});

/**
 * ViewerContext shares server-resolved viewer state with the NavMenu client
 * component without prop-drilling through PageTitle.
 *
 * It is provided by the `[username]` layout, which already fetches the owner
 * and session in order to render the GuestBanner. NavMenu consumes it to:
 *  - hide the Edit link when the viewer is not the profile owner
 *  - hide the Logout button when no session exists
 *  - show a "My Archetypes" shortcut when a logged-in non-owner is browsing
 *    someone else's profile
 *
 * Pages outside the `[username]` layout (login, register) have no provider,
 * so the context defaults apply: `isOwner: true`, `isLoggedIn: false`,
 * `viewerUsername: null`. This keeps the menu correct on those pages without
 * requiring every page to supply the provider.
 */
const ViewerProvider = ({
  children,
  isOwner,
  isLoggedIn,
  viewerUsername,
}: {
  children: React.ReactNode;
  isOwner: boolean;
  isLoggedIn: boolean;
  viewerUsername: string | null;
}) => {
  return (
    <ViewerContext.Provider value={{ isOwner, isLoggedIn, viewerUsername }}>
      {children}
    </ViewerContext.Provider>
  );
};

const useViewer = () => useContext(ViewerContext);

export { ViewerProvider, useViewer };
