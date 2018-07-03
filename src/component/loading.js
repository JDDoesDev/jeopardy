import React from 'react';
import Spinner from 'react-spinkit';
import { Col, Row, Grid } from 'react-bootstrap';

const LoadingScreen = (props) => {
  return (
    <Grid>
      <Row className='flex-row'>
        <Col xs={12}>
          <div className='prefix'>
            Welcome to
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h1>
            GEPPARDY
          </h1>
        </Col>
      </Row>
      { (props.loaded !== true) ?
      <Row>
        <Spinner name='pacman' color='black'/>
      </Row> :
      <Row>
        { props.menu }
      </Row>
       }
    </Grid>
  );
}

export default LoadingScreen;
