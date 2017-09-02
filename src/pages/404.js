import React from "react";

import {Link} from "react-router";

const NotFound = props =>
  <div>
    <Link to="/">
      <img style={{padding: "30px"}} src="img/educhat-logo.png" height="100" alt="edu.chat logo"/>
    </Link>
    <h1 style={{textAlign: "center"}}>:(</h1>
    <h1 style={{textAlign: "center"}}>Page not found</h1>
  </div>;

export default NotFound;
