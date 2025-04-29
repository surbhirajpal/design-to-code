import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const MyComponent = () => (
  <Card>
    <Card.Header>Card Header</Card.Header>
    <Card.Img variant="top" src="image-placeholder <- Change image here" />
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">Sub Title</Card.Subtitle>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk of the card's content.
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
    <Card.Body>
      <Card.Link href="#">Card link</Card.Link>
      <Card.Link href="#">Another link</Card.Link>
    </Card.Body>
  </Card>
);

export default MyComponent;