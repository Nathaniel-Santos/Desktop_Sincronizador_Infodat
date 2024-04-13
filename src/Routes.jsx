import React from 'react'
// import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import {HashRouter,Link,Route,Switch} from "react-router-dom";
import App from './App'
import Home from './Pages/Home';
import DownloadGrades from './Pages/DownloadGrades';
import UpdateSite from './Pages/UpdateSite';
import ConnectionWeb from './Pages/ConnectionWeb';
import Settings from './Pages/Settings';

function RoutesApp() {
  return (
    <HashRouter >

      <Switch>
        <Route exact path="/" render={(props) => <App {...props}/>} />
        <Route exact path="/Home" component={Home} />
        <Route exact path="/notas/download" component={DownloadGrades} />
        <Route exact path="/site/upload" component={UpdateSite} />
        <Route exact path="/connectionWeb" component={ConnectionWeb} />
        <Route exact path="/config" component={Settings} />
      </Switch>
    </HashRouter>
  );
}

export default RoutesApp
