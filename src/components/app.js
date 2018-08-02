import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken} from '../actions/auth';

import {clearAuth} from '../actions/auth';
import {clearAuthToken} from '../local-storage';




export class App extends React.Component {
    constructor(props) {
    super(props)
    this.countDown = null
    this.alertCounter = null
    //this.onIdle = 
  }
 


    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            10 * 60 * 1000 // ten minutes
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    logout() {
        this.props.dispatch(clearAuth()),
        clearAuthToken()

    }

    logoutIdleTimerReset() {
        console.log('logoutTimer Reset ')
            clearTimeout(this.countDown)
            //setTimeout(() => this.logout(), 3 * 1000) //not assigned to var too difficult
            this.logoutIdleTimer()
    }

    //let countDown;
    logoutIdleTimer() {
        clearTimeout(this.countDown)
        clearTimeout(this.alertCounter)
        this.countDown = setTimeout(() => this.logout(), 5 * 60 * 1000)//5 minutes
        this.alertCounter = setTimeout(() => alert('Still there?'), 4 * 60* 1000)//4 min
        
    
    }
    // //timeout is just an id to the thing that it's counting
    // displayLogoutWarning() {
    //     if(this.countDown=== 3 * 1000){
    //         alert('Are you still there?')
    //     };
    // }

    render() {
        return (
            <div className="app" onLoad={this.logoutIdleTimer()}
                                onClick={() => this.logoutIdleTimer()}
                                >
       
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            
        </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
