import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api/api';

export const Route = createFileRoute('/_authenticated/add-book')({
  component: AddBook,
});

function AddBook() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: '',
      category: '',
      author: '',
      publisher: '',
      year: '',
      isbn: '',
      issn: '',
      price: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(value);
      const res = await api.books.$post({
        json: {
          ...value,
          year: Number(value.year),
          price: Number(value.price),
        },
      });

      if (!res.ok) {
        alert('Failed to add book');
        return;
      }

      toast('Book added successfully');
      form.reset();
      navigate({ to: '/books' });
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
      <h2 className="text-2xl font-bold">Add Book</h2>
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
            {isSubmitting ? 'Submitting...' : 'Add Book'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
