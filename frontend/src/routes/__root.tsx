import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { ModeToggle } from '@/components/mode-toogle';
import { Toaster } from '@/components/ui/sonner';

const Root = () => (
  <>
    <NavBar />
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
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
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <ModeToggle />
  </div>
);

export const Route = createRootRoute({
  component: Root,
});
