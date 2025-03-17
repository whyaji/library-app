import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <div className="flex flex-col gap-2 max-w-xl m-auto mt-6">
      <h1 className="text-2xl font-bold">About Library App</h1>
      <p>
        Welcome to the Library App! This application allows you to manage a collection of books with
        ease. You can perform CRUD (Create, Read, Update, Delete) operations on books, ensuring your
        library is always up-to-date.
      </p>
      <p>
        Additionally, the app includes user authentication and management features, allowing you to
        securely manage user access and permissions.
      </p>
    </div>
  );
}
