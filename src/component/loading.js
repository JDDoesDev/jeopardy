import React from 'react';
import Spinner from 'react-spinkit';
import { Col, Row, Grid } from 'react-bootstrap';

const LoadingScreen = (props) => {
  return (
    <div className='title-card-wrapper'>
      <Grid className='title-card'>
        <Row className='flex-row'>
          <Col>
            <div className='prefix'>
              Welcome to
            </div>
          </Col>
        </Row>
        <Row className='flex-row'>
          <Col>
            <h1>
              Drupaldy
            </h1>
          </Col>
        </Row>
        { (props.loaded !== true) ?
        <Row className='flex-row'>
          <Spinner name='pacman' color='white'/>
        </Row> :
        <Row className='flex-row'>
          { props.menu }
        </Row>
         }
      </Grid>
    </div>
  );
}

export default LoadingScreen;
