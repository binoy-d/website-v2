import React, {useState} from 'react';
import './NavBar.css';
import Fade from 'react-reveal/Fade'
import NavLink from './NavLink'
import Hamburger from 'hamburger-react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
function NavMenu({visible}){
    return (
        <div className = {"nav-menu visible-"+visible}>
            <div className="nav-small-item"><NavLink text="About" destination="about" /></div>
            <div className="nav-small-item"><NavLink text="Experience" destination="experience" /></div>
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

function ResumeModal({show, handleClose}){
    return (
        <div className = "resume-modal">
        <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <object className = "resume-data" data={process.env.PUBLIC_URL + '/files/resume.pdf'} type="application/pdf">
            <embed src={process.env.PUBLIC_URL + '/files/resume.pdf'} type="application/pdf" />
        </object>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
}
//process.env.PUBLIC_URL + '/files/resume.pdf'

function NavBar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
        <Fade top>
            <div className="navbar-collapse">
                <div className="navbar-large">
                    <div className="nav-large-item"><NavLink text="About" destination="about" /></div>
                    <div className="nav-large-item"><NavLink text="Experience" destination="experience" /></div>
                    <div className="nav-large-item"><NavLink text="Skills" destination="skills" /></div>
                    <div className="nav-large-item"><NavLink text="Projects" destination="projects" /></div>
                    <div className="nav-large-item">
                        <div onClick = {handleShow} className="btn btn-outline-light resume-btn">Resume</div>
                    </div>
                </div>
                <OverlayNav />
            </div>
        </Fade>
        <ResumeModal show={show} handleClose={handleClose}/>
        </>
    );
}

export default NavBar;
