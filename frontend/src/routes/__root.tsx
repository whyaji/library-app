import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

import { ModeToggle } from '@/components/mode-toogle';
import { Toaster } from '@/components/ui/sonner';

const Root = () => (
  <>
    <NavBar />
    <hr />
    <Outlet />
    {/* <TanStackRouterDevtools /> */}
    <Toaster />
  </>
);

const NavBar = () => (
  <div className="flex justify-between">
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/books" className="[&.active]:font-bold">
        Books
      </Link>{' '}
      <Link to="/add-book" className="[&.active]:font-bold">
        Add Book
      </Link>{' '}
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <ModeToggle />
  </div>
);

interface MyRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: Root,
});
