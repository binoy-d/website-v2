import React, {useState} from 'react';
import './NavBar.css';
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Hamburger from 'hamburger-react'


function NavMenu({visible}){
    return (
        <div className = {"nav-menu visible-"+visible}>
            <div className="nav-small-item"><NavLink text="About" destination="about" /></div>
            <div className="nav-small-item"><NavLink text="Skills" destination="skills" /></div>
            <div className="nav-small-item"><NavLink text="Projects" destination="projects" /></div>
            <div className="nav-small-item">
                <a className = "resume-link" href={process.env.PUBLIC_URL + '/files/resume.pdf'}>Resume</a>
            </div>
        </div>
    );
}


class OverlayNav extends React.Component {
    constructor(props){
        super(props);;
        this.state = {open:false};
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({open:!this.state.open});
        console.log(this.state.open);
    }

    render(){
        return (
            <>
            
            <div className = "navbar-small">
                <Hamburger toggled={this.state.open} toggle={this.toggle}/>
                <NavMenu visible = {this.state.open} />
            </div>
            </>
        );    
    }
}



function NavBar() {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <Fade top>
            <div className="navbar-collapse">
                <div className="navbar-large">
                    <div className="nav-large-item"><NavLink text="About" destination="about" /></div>
                    <div className="nav-large-item"><NavLink text="Skills" destination="skills" /></div>
                    <div className="nav-large-item"><NavLink text="Projects" destination="projects" /></div>
                    <div className="nav-large-item">
                        <a href={process.env.PUBLIC_URL + '/files/resume.pdf'} className="btn btn-outline-light resume-btn">Resume</a>
                    </div>
                </div>
                <OverlayNav />
            </div>
        </Fade>
    );
}

export default NavBar;
