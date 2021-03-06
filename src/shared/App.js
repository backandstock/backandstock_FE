import React, { useEffect, Suspense, lazy } from "react";
import "./App.css";
import GlobalStyle from "./GlobalStyles";
import styled from "styled-components";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { history } from "../redux/configStore";
import { useDispatch } from "react-redux";

import { actionCreators as userActions } from "../redux/modules/user";
import { BackTest, Login, Signup } from "../pages";
import { Header, SideTap, Footer } from "../components";
import { getToken } from "./token";

import Social from "./Social";
import ReactGA from "react-ga";

const Community = lazy(() => import("../pages/Community/Community"));
const Mypage = lazy(() => import("../pages/Mypage/Mypage"));
const Result = lazy(() => import("../pages/Result/Result"));
const Detail = lazy(() => import("../pages/Detail/Detail"));
const BestDetail = lazy(() => import("../pages/BestDetail/BestDetail"));

const TRACKING_ID = "UA-224025265-1";

function App() {
  const dispatch = useDispatch();

  const is_token = getToken("token");

  useEffect(() => {
    if (is_token) {
      dispatch(userActions.LoginCheckDB());
    }
  });

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    history.listen((location) => {
      ReactGA.set({ page: location.pathname }); // Update the user's current page
      ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });
    // ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <AppWrap className="App">
      <GlobalStyle />
      <ConnectedRouter history={history}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/oauth/kakao/callback" exact component={Social} />
            <ContentWrap>
              <Header />
              <SideTap />
              <RouteWrap>
                <Route path="/" exact component={BackTest} />
                <Route path="/community" exact component={Community} />
                <Route path="/mypage" exact component={Mypage}></Route>
                <Route path="/result" exact component={Result}></Route>
                <Route path="/detail/:id" exact component={Detail}></Route>
                <Route path="/community/detail/:id" exact component={BestDetail}></Route>
                <Footer />
              </RouteWrap>
            </ContentWrap>
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </AppWrap>
  );
}

const AppWrap = styled.div``;

const ContentWrap = styled.div`
  padding-left: calc(30.9vw - 293px);
  //width: 100vw;
  display: flex;

  @media only screen and (max-width: 1360px) {
    padding-left: 0;
  }
`;

const RouteWrap = styled.div`
  margin-left: 293px;
  margin-top: 80px;
  width: 100%;
  overflow-x: hidden;
`;

export default App;
