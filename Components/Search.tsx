import { useEffect, useState, FC } from 'react';
import { Form } from 'react-bootstrap';
import { Book } from './types';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  booksArray: Array<Book>;
  setResultArray: Dispatch<SetStateAction<Array<Book>>>;
}
const Search: FC<Props> = ({ booksArray, setResultArray }) => {
  const [search, setSearch] = useState<string>('');

  // search based on title or author from authors in booksArray
  const findBooks = (search: string) => {
    const result = booksArray.filter((book) => {
      return (
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        // check if author is in book.authors including substring
        book.authors.some((author) =>
          author.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
    setResultArray(result || booksArray);
  };

  useEffect(() => {
    findBooks(search);
  }, [search]);

  return (
    <Form>
      <Form.Group controlId='formBasicEmail'>
        <Form.Control
          type='text'
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};

export default Search;
