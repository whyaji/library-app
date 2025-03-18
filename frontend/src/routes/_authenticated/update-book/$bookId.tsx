import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getBook, updateBook } from '@/lib/api/bookApi';

export const Route = createFileRoute('/_authenticated/update-book/$bookId')({
  loader: async ({ params }) => {
    try {
      const res = await getBook(params.bookId);
      return { book: res.data };
    } catch {
      return { book: null };
    }
  },
  component: UpdateBookComponent,
});

function UpdateBookComponent() {
  const { book } = Route.useLoaderData();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: book?.title ?? '',
      category: book?.category ?? '',
      author: book?.author ?? '',
      publisher: book?.publisher ?? '',
      year: book?.year.toString() ?? '',
      isbn: book?.isbn ?? '',
      issn: book?.issn ?? '',
      price: book?.price.toString() ?? '',
      notes: book?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (!book) {
          alert('Book not found');
          return;
        }
        await updateBook({
          id: Number.parseInt(book.id.toString()),
          ...value,
          year: Number(value.year),
          price: Number(value.price),
        });
        toast('Book updated successfully');
        form.reset();
        navigate({ to: '/books' });
      } catch {
        alert('Failed to update book');
      }
    },
  });

  const formItem: {
    name: keyof (typeof form)['state']['values'];
    label: string;
    type: string;
  }[] = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'publisher', label: 'Publisher', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'isbn', label: 'ISBN', type: 'text' },
    { name: 'issn', label: 'ISSN', type: 'text' },
    { name: 'price', label: 'Price (Rp)', type: 'number' },
    { name: 'notes', label: 'Notes', type: 'text' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">Update Book</h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => (
            <>
              <Label htmlFor={field.name}>{item.label}</Label>
              {item.name === 'notes' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={item.type}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      ))}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Update Book'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
