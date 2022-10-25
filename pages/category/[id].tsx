import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Card,
  Container,
  Form,
  Stack,
  Pagination,
  Nav,
  Navbar,
  Modal,
  Button,
} from 'react-bootstrap';
import Navigation from '../../Components/Navigation';
import Search from '../../Components/Search';
import { Book } from '../../Components/types';
const Books = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Array<Book>>(Array<Book>);
  const [page, setPage] = useState(router.query.page || 0);
  const [size, setSize] = useState(router.query.size || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [resultArray, setResultArray] = useState<Array<Book>>([]);
  const { id, category } = router.query;
  const [isMd, setIsMd] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [favBooks, setFavBooks] = useState<Array<Book>>(Array<Book>);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // setfavorites from local storage
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      setFavBooks(JSON.parse(favorites));
    }
  }, [localStorage]);

  // check if book is in favorites
  useEffect(() => {
    if (selectedBook) {
      const isFav = favBooks.some((favBook) => favBook.id === selectedBook.id);
      setIsFav(isFav);
    }
  }, [selectedBook, favBooks]);

  if (typeof window !== 'undefined') {
    useEffect(() => {
      if (window.innerWidth < 768) {
        setIsMd(true);
      }
    }, [window.innerWidth]);
  }

  //   query to get books by id
  const fetchBooks = async () => {
    // add size and page only if size exists
    const res = await fetch(
      `http://localhost:3000/api/books/${id}?` +
        (size ? `size=${size}&page=${page}` : '')
    );
    const data = await res.json();
    return data;
  };

  const getTotalPages = async () => {
    // get all entries
    const res = await fetch(`http://localhost:3000/api/books/${id}`);
    const data = await res.json();

    // get total pages
    const totalPages = Math.ceil(data.length / Number(size));
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data);
      setResultArray(data);
    });

    getTotalPages();
  }, [id, page, size]);

  return (
    <>
      <Navigation />
      <Container className='my-2'>
        {/* horizontal stack if large */}
        <Container className='my-2'>
          <h1>{category}</h1>
          <Search booksArray={books} setResultArray={setResultArray} />
          <Form.Select
            size='sm'
            onChange={(e) => {
              setSize(e?.target?.value);
            }}
          >
            <option value={10}>Books per page</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
            <option value={''}>All</option>
          </Form.Select>
        </Container>
        <Stack
          gap={2}
          direction={isMd ? 'vertical' : 'horizontal'}
          className='d-flex flex-wrap justify-content-center align-items-start'
        >
          {resultArray.map((book: any, index: number) => (
            <Card
              className='p-3 m-auto my-2'
              key={index}
              style={{ width: '18rem' }}
              onClick={() => {
                selectedBook !== book && setSelectedBook(book);
                handleShow();
              }}
            >
              <Card.Img variant='top' src={book.cover_url} />
              <Card.Body>
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                {/* authors separated by comma */}
                <p>Authors: {book.authors.join(', ')}</p>
                {/* audio length in 00:00:00 */}
                <p>
                  Audio length:{' '}
                  {new Date(book.audio_length * 1000)
                    .toISOString()
                    .substr(11, 8)}
                </p>
              </Card.Body>
              {/* modal */}
            </Card>
          ))}
        </Stack>
      </Container>
      {/* modal to show selected book */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBook?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* favorites button */}
          {
            /* check if selected book is already in fav */
            /* if yes, show remove from fav button */
            /* if no, show add to fav button */

            isFav ? (
              <Button
                variant='danger'
                onClick={() => {
                  const newFavBooks = favBooks.filter(
                    (favBook) => favBook.id !== selectedBook?.id
                  );
                  setFavBooks(newFavBooks);
                  localStorage.setItem(
                    'favorites',
                    JSON.stringify(newFavBooks)
                  );
                  setIsFav(false);
                }}
              >
                Remove from favorites
              </Button>
            ) : (
              <Button
                variant='success'
                onClick={() => {
                  const newFavBooks = [
                    ...favBooks,
                    selectedBook || ({} as Book),
                  ];
                  if (newFavBooks !== undefined) {
                    setFavBooks(newFavBooks);
                    localStorage.setItem(
                      'favorites',
                      JSON.stringify(newFavBooks)
                    );
                    setIsFav(true);
                  }
                }}
              >
                Add to favorites
              </Button>
            )
          }

          {selectedBook?.sections?.map((section: any, index: number) => (
            <div key={index}>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* footer navbar sticky to bottom */}
      {size ? (
        <Navbar
          sticky='bottom'
          className='d-flex justify-content-center
          '
        >
          <Pagination
            className='d-flex
          justify-content-center
          '
          >
            <Pagination.First
              onClick={() => {
                setPage(0);
              }}
            />
            <Pagination.Prev
              onClick={() => {
                if (Number(page) > 0) {
                  setPage(Number(page) - 1);
                }
              }}
            />
            <Pagination.Item active>{Number(page) + 1}</Pagination.Item>
            <Pagination.Next
              onClick={() => {
                // check if there are more pages
                if (Number(page) < totalPages - 1) {
                  setPage(Number(page) + 1);
                }
              }}
            />
            <Pagination.Last
              onClick={() => {
                setPage(totalPages - 1);
              }}
            />
          </Pagination>
        </Navbar>
      ) : null}
    </>
  );
};

export default Books;
