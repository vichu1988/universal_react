/**
 * Created by mambig on 5/25/2016.
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';

import DisplayCountries from '../containers';
import CountryDetailsWrapper from '../containers/CountryDetailsWrapper';

export default (
  <Route path="/">
    <IndexRoute component={DisplayCountries}/>
    <Route path="countries/:id" component={CountryDetailsWrapper}/>
  </Route>

);