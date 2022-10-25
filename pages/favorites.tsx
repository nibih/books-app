import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, Container, Stack, Modal, Button } from 'react-bootstrap';
import Search from '../Components/Search';
import Navigation from '../Components/Navigation';
import { Book } from '../Components/types';

const Books = () => {
  const [books, setBooks] = useState<Array<Book>>(Array<Book>);
  const [resultArray, setResultArray] = useState<Array<Book>>([]);
  const [isMd, setIsMd] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (typeof window !== 'undefined') {
    useEffect(() => {
      if (window.innerWidth < 768) {
        setIsMd(true);
      }
    }, [window.innerWidth]);
  }

  // get favorites from local storage and set them to state books
  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      setBooks(JSON.parse(favorites));
      setResultArray(JSON.parse(favorites));
    }
  }, []);

  useEffect(() => {
    setResultArray(books);
  }, [books]);

  return (
    <>
      <Navigation />
      <Container className='my-2'>
        {/* horizontal stack if large */}
        <Container className='my-2'>
          <h1>Favorites</h1>
          <Search booksArray={books} setResultArray={setResultArray} />
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
          <Button
            variant='primary'
            onClick={
              // remove from local storage if already there
              // check by id
              () => {
                const favorites = localStorage.getItem('favorites');
                if (favorites) {
                  const favoritesArray = JSON.parse(favorites);
                  const index = favoritesArray.findIndex(
                    (book: Book) => book.id === selectedBook?.id
                  );
                  if (index !== -1) {
                    favoritesArray.splice(index, 1);
                    localStorage.setItem(
                      'favorites',
                      JSON.stringify(favoritesArray)
                    );
                    setBooks(favoritesArray);
                    handleClose();
                  }
                }
              }
            }
          >
            Remove from favorites
          </Button>

          {selectedBook?.sections?.map((section: any, index: number) => (
            <div key={index}>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default Books;
